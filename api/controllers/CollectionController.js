/**
 * CollectionController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

fs = require("fs");

var imagePath = "/assets/images/cards/"

var primaryLanguage = ""

module.exports = {

  index: function (req, res) {

          if (!sails.config.collection) {
              return res.send(404);
          }

      console.log(req.session)

          Card.find({type: sails.config.collection.model.toLowerCase()})
              .populate('images')
              .sort('name_'+req.session.primaryLanguage.name)
              .exec(function (err,cards) {

              if (req.wantsJSON) {
                  if (err) return res.send(err,500);
                  if (!cards) return res.send("No cards exist!", 404);

                  return res.json(cards);
              } else {
                  return res.view('collection/index', {
                    cards: cards,
                    collection: sails.config.collection

                  });
              }

          });

    },

  find: function (req, res) {

      //if (sails.config.collection) {

          Card.findOne({id: req.param('id')}).populate("images").exec(function (err, card) {

              if (card) {

                  sails.jumbotron = undefined;

                  return res.view('collection/find',{
                      card: card,
                      collection: sails.config.collection
                  })

              } else {
                  res.send(404);
              }
          })
/*
      } else {
          res.send(404)
      }*/
  },

  new: function (req, res) {
      return res.view();
  },

  newcard: function (req, res) {
      return res.view();
  },

  editcard: function (req, res) {

      if (sails.config.collection) {

         Card.findOne({id: req.param('id') }).populate("images").exec(function (err,card) {

              if (err) return res.send(err,500)
              if (!card) return res.send("Card not found!", 404)

              sails.jumbotron = undefined;

              return res.view({
                 card: card
              })
          })

      } else {
          res.send(404)
      }
  },

  create: function(req, res) {

        Collection.create({
            name: req.body.name,
            model: req.body.model,
            path: req.body.path,
            active: true
        }).exec(function(err, collection) {

                // Error handling
                if (err) {
                    return console.log(err);

                    // The collection was created successfully!
                }else {
                    console.log("Collection created:", collection);
                }

                return res.redirect("/"+collection.path)
            });
    },

  createcard: function(req, res) {

      Card.create({
          name_scientific: req.body.name_scientific,
          name_finnish: req.body.name_finnish,
          name_english: req.body.name_english
      }).exec(function(err, card) {

          // Error handling
          if (err) {
              return console.log(err);

              // The User was created successfully!
          }else {
              console.log("Card created:", card);
          }

          // Save images
          if (req.files.images) {

              req.files.images.forEach(function(image, index){

                  req.files.images[index].localPath = imagePath

                  req.files.images[index].name = card.name_scientific.replace(/ /gi,"_").replace(/'/g,"") + '-' + index + '.jpg'
                  req.files.images[index].card = card.id

                  if (req.body.imageSrcInfo) {
                      if (req.body.imageSrcInfo[index]) {
                          req.files.images[index].sourceInfo = req.body.imageSrcInfo[index]

                      }
                  }
                  if (req.body.imageSrcUrl) {
                      if (req.body.imageSrcUrl[index]) {
                          req.files.images[index].sourceUrl = req.body.imageSrcUrl[index]
                      }
                  }
              })

              console.log(req.files.images)

              Image.saveImages(req.files.images)
          }

          return res.redirect("/"+sails.config.collection.path)
      });
  },

  updatecard: function(req, res) {

        Card.update({id: req.param('id')}, {
            name_scientific: req.body.name_scientific,
            name_finnish: req.body.name_finnish,
            name_english: req.body.name_english
        }).exec(function(err, cards) {

                console.log(cards)

                // Error handling
                if (err) {
                    return console.log(err)
                }else {
                    console.log("Card updated:", cards[0])
                }

                req.file('images[]').upload(function onUploadComplete (err, files) {
                    if (err) return res.serverError(err);

                    files.forEach(function(file, index){

                        console.log(file)

                        // Create image in db
                        Image.create({
                            name: file.filename,
                            card: cards[0].id,
                            localPath: "/assets/images/cards/",
                            contentType: file.type,
                            sizeKb: file.size / 1024 | 0

                        }).exec(function(err, image) {

                                // Error handling
                                if (err) return console.log(err)

                                var newName = cards[0].name_scientific.replace(/ /g,"_").replace(/'/g,"")+"-"+image.id+"."+file.type.match(/(gif|jpg|jpeg|png)$/)[0];

                                fs.rename('.tmp/uploads/'+image.name, process.cwd() + image.localPath + newName, function (err) {

                                    im.identify(process.cwd() + image.localPath + newName, function(err, features){

                                       if (err) return

                                       Image.update({ id: image.id}, { name: newName, height: features.height, width: features.width, format: features.format }).exec(function(err, imageUpdated) {
                                            console.log("New image saved and uploaded;", imageUpdated)
                                        })
                                    });

                                });

                        });



                    })

                    //console.log(files)

                    //Image.saveImages(files)

                    console.log("All done, redirect.")

                    return res.redirect("/"+sails.config.collection.path)

                });


            });
    },

  destroycard: function (req, res) {

      Card.destroy({id: req.param('id')}).exec(function(card){

          console.log("Card deleted:" + card)

      })

      return res.redirect("/"+req.body.collection.path)
  },

    setPrimaryLanguage: function (req, res) {

    console.log("setPrimaryLanguage:" + req.param("primaryLanguage"))

    Language.findOne({short: req.param("primaryLanguage")}).exec(function(err, primaryLanguage) {

        if (primaryLanguage) {
            req.session.primaryLanguage = primaryLanguage;
            req.session.alert = { type: "success", msg: 'Primary language set to <strong>'+primaryLanguage.label+'</strong>.' }
        }

        console.log(req.session)

        return res.redirect("back")
    })

    },

    listCards: function (req, res) {

        var q = {}

        if (req.param("collection")) {
            q.type = req.param("collection");
        }

        console.log(q);

        Card.find(q)
            .exec(function (err,cards) {

                    if (err) return res.send(err,500);
                    if (!cards) return res.send("No cards exist!", 404);

                    console.log("return JSON list of cards");

                    //return res.json(['Picea abies','Picea pungens','Picea breweriana','Picea stichensis','Picea engelmannii','Picea glauca','Picea omorika','Picea koraiensis','Picea orientalis'])
                    return res.json(cards);

            });
    }

};
