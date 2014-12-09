/**
 * Allow any authenticated user.
 */
module.exports = function(req, res, next) {

    var collection = req.param("collection");

    console.log(collection);

    switch (collection) {

        case "Insects":

            sails.jumbotron = {
                title: "MER111",
                caption: "Metsäeläintieteen perusteet.",
                bg: "/images/entomology.jpg",
                sourceInfo: "Enns Entomology Museum",
                sourceUrl: "http://cafnrnews.com/2013/06/digital-bugs/"
            }
            break;

        case "Birds":

            sails.jumbotron = {
                title: "MER115",
                caption: "Lintujen ja nisäkkäiden lajintuntemus II",
                bg: "/images/puffin.jpg",
                sourceInfo: "Minna Etsalo",
                sourceUrl: "http://www.flickr.com/photos/minnaetsalo/sets/72157627106142511/"
            }
            break;

        case "Moss":

            console.log("Here we set Moss.");

            sails.jumbotron = {
                title: "MER160",
                caption: "Soiden ekohydrologia ja kasvillisuus",
                bg: "/images/swamp.jpg",
                sourceInfo: "Noah Elhardt",
                sourceUrl: "http://commons.wikimedia.org/wiki/File:Drosera_rotundifolia_ne3.jpg"
            }
            break;

        case "Plants":

            sails.jumbotron = {
                title: "KASV148",
                caption: "Metsälajintuntemus",
                bg: "/images/flower_and_bee.jpg",
                sourceInfo: "Thomas Moon",
                sourceUrl: "http://ThomasMoon.NET"
            }
            break;

        default:

            sails.jumbotron = {
                title: "PinkkaV2",
                caption: "Concept for a better online learning environment.",
                bg: "/images/woods_in_england.jpg",
                sourceInfo: "Thomas Moon",
                sourceUrl: "http://ThomasMoon.NET"
            }
    }

    next()
};