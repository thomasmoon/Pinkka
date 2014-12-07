/**
 * ImageController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var sys = require("sys"),
    path = require("path"),
    url = require("url"),
    fs = require("fs"),
    im = require('imagemagick');

var acceptableWidths = [75, 150, 200, 785]

var imagePath = '/assets/images/cards/'

var resizePattern = "-resized-([0-9]+)px"

module.exports = {

  destroy: function (req, res) {

      Image.findOne({id: req.param('id')}, function(err, imageToDelete){
          console.log(imageToDelete);

          var fullPath = process.cwd() + imageToDelete.localPath + imageToDelete.name;

          Image.destroy({id: imageToDelete.id }).exec(function(err, image){

              console.log("Deleting: "+ fullPath)

              fs.unlink(fullPath, function(err){
                  if (err) {
                      //throw err;
                      // Image does not exist in file system
                      return res.redirect('back')
                  }

                  acceptableWidths.forEach(function(width){
                      console.log("Deleting: "+ fullPath.replace('.jpg', '-resized-'+width+'px.jpg'))
                      fs.unlink(fullPath.replace('.jpg', '-resized-'+width+'px.jpg'))
                  })
              })

              return res.redirect('back')
          })

      })
  },

  resize: function (req, res) {
      var imagePath = '/assets/images/cards/'
      var path_absolute = path.join(process.cwd(), imagePath);
      var imageName = req.param('imageName')


      // Check to see if we should generate a resized image
      var result = imageName.match(resizePattern)

      fs.exists(path_absolute+imageName, function(exists){
          if(!exists){

              // Check to see if we should generate a resized image
              var result = imageName.match(resizePattern)

              if (result instanceof Array) {
                  var masterImage = imageName.replace(result[0], '');

                  console.log("We need to resize, let's look for the master image.");

                  console.log("looking for this one:" + path_absolute+masterImage)

                  // check to make sure the original exists
                  // Note: would rather use identify() here, so the width of the original can be checked
                  // and we can avoid resizing the image any larger, but it's too memory demanding
                  fs.exists(path_absolute+masterImage,function(exists){

                      console.log(exists)

                      if(exists && acceptableWidths.indexOf(parseInt(result[1]))>=0){

                          /* can only do this with im.identify
                          if (result[1] > features.width) {
                              return Image.deliverImage(res, path_absolute+masterImage);
                          }*/

                          console.log(exists);

                          console.log("Time to resize the image.");

                          console.log("source path: " + path_absolute + masterImage);
                          console.log("dest path: " + path_absolute + imageName);
                          console.log("width: " + result[1]);
                          try {
                              // resize, save and deliver the thumbnail
                              im.resize({
                                  srcPath:  path_absolute + masterImage,
                                  dstPath:  path_absolute + imageName,
                                  width:    result[1]
                              }, function(err, stdout, stderr){

                                  if(err)
                                      console.log(err)
                                  else {
                                    console.log( masterImage + 'has been resized and saved as ' + imageName);
                                    return Image.deliverImage(res, path_absolute + imageName);
                                  }
                              });

                          }
                          catch(e) {
                              console.log('Whao:');
                              return res.send(404);
                          }

                      } else {
                          console.log("Master image does not exist, sending 404");
                          return res.send(404);

                      }
                  });

              }

          }
          else{
              return Image.deliverImage(res, path_absolute + imageName);
          }
      })
  },

    update: function(req, res) {

        console.log(req.body);

        Image.update({id: req.param('id')}, {
            sourceInfo: req.body.sourceInfo,
            sourceUrl: req.body.sourceUrl,
            type: req.body.imageType
        }).exec(function(err, images) {

                // Error handling
                if (err) {
                    return console.log(err)
                }else {
                    console.log("Image updated:", images[0])
                    return res.send("Image updated.")
                }

        });
    },

  create: function(req, res) {

      console.log('create image');

      console.log(req.file('images[]'));

          req.file('images[]').upload(function onUploadComplete (err, files) {
              if (err) return res.serverError(err);

              files.forEach(function(file, index){

                  console.log(file)

                  return;

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
          })

  },

  imageBatch: function(req, res) {

      // disable
      return res.send(404);

      fs.readdir(process.cwd() + imagePath, function (err, files) {

          files.forEach(function(file){

              var regex = ".jpg";
              var result = file.match(regex);

              if (result) {
                  var cardName = file.replace('.jpg', '').replace('_',' ');

                  im.identify(process.cwd() + localPath + file, function(err, features) {

                      Image.create({name: file,
                          card: cardName,
                          localPath: localPath,
                          width: features.width,
                          height: features.height,
                          sizeKb: features.filesize.replace('KB',''),
                          contentType: 'image/jpeg'
                      }).exec(function(err, image){
                              console.log(image)
                          })
                  })
              }
          })
      })
  }
};
