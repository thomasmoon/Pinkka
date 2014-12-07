/**
 * Image
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

im = require('imagemagick');

ImageModel = {

  attributes: {

	name:           'string',
    localPath:      'string',
    caption:        'string',
	sourceInfo:     'string',
    sourceUrl:      'string',
    type:           { type: 'string', enum: ['photo', 'illustration', 'specimen'] },
    detail:         { type: 'string' }, // ie. head, thorax, wings, root, flower (tricky cross-kingdom)
    contentType:    'string',
    format:         'string',
    width:          'integer',
    height:         'integer',
    sizeKb:         'integer',

    card:{
        model:'card'
    }
  },

  imageTypes: [{name: 'photo', label:'Photos', labelOne: 'Photo', icon: 'camera'},
      {name:'illustration',label:'Illustrations', labelOne: 'Illustration', icon:'pencil'},
      {name:'specimen',label:'Specimens', labelOne: 'Specimen', icon:'leaf'}],

  saveImages: function(images) {

    images.forEach(function(image){

      var fullPath = process.cwd() + image.localPath;

      fs.rename('.tmp/uploads/'+image.filename, fullPath + image.name, function (err) {

          if (err) {
              //console.log(err)
              console.log("should we send 404 now")
              return res.send(404);
          }

          im.identify(fullPath + image.name, function(err, features){

              if (err) {
                  console.log(err)
                  //res.writeHeader(404, {"Content-Type": "text/plain"});
                  //res.write(err + "\n");
                  return null;
              }

              Image.create({
                  name: image.name,
                  card: image.card,
                  localPath: image.localPath,
                  sourceInfo: image.sourceInfo,
                  sourceUrl: image.sourceUrl,
                  contentType: image.type,
                  format: features.format,
                  width: features.width,
                  height: features.height,
                  sizeKb: image.size / 1024 | 0

              }).exec(function(err, image) {

                      // Error handling
                      if (err) {
                          return console.log(err);

                          // The Image was created successfully!
                      }else {
                          console.log("Image created:", image);
                      }

              });

          });

          console.log('Uploaded image moved to correct location and saved to database.');
      })
    })
  },

    deliverImage: function(res, imageName) {
        fs.readFile(imageName, "binary", function(err, file) {
            if(err) {
                res.writeHeader(500, {"Content-Type": "text/plain"});
                res.write(err + "\n");
                return res.end();
            }
            else{
                res.writeHeader(200);
                res.write(file, "binary");
                return res.end();
            }

        });
    }

};


module.exports = ImageModel