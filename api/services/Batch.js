module.exports = {

    ConvertModelsToCards: function (model) {

        console.log(model)

            eval(model).find().exec(function(err, items){

            items.forEach(function(item){

                // Create new card based on plant
                Card.create({
                    name_scientific:    item.name_scientific,
                    name_finnish:       item.name_finnish,
                    name_english:       item.name_english,
                    type:               model.toLowerCase()
                }).exec(function(err, card) {

                        console.log("Card:")
                        console.log(card)

                        // Find images linked to plant
                        Image.find({name: card.name_scientific.replace(/ /gi,"_").replace(/'/g,"") + '.jpg'}).exec(function(err, images){

                            images.forEach(function(image){
                                // Adding images to card
                                Image.update({id: image.id}, { card: card.id }).exec(function(err, image){
                                    console.log("Image added to card (" + card.name_scientific + "):")
                                    console.log(image)
                                })
                            })

                            //console.log(card)
                        })

                    })
            })

        })
    }

}