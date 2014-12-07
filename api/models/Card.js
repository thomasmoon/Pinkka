/**
 * Insect
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {

	name_scientific: 'string',
	name_finnish: 'string',
	name_english: 'string',

    type: { type: 'string', enum: ['plant', 'insect', 'bird', 'mammal', 'reptile', 'fungus', 'lichen', 'moss'] },

    images:{
        collection: 'image',
        via: 'card'
    }
    
  }

};
