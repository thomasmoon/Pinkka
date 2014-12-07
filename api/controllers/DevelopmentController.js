/**
 * DevelopmentController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  index: function (req, res) {

      return res.view('home/development',{
        customJumbotron: {
          title: "PinkkaV2",
          caption: "Concept for a better online learning environment.",
          bg: "/images/woods_in_england.jpg",
          sourceInfo: "Thomas Moon"
        }
      })
  }

  

};
