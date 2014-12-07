/**
 * Language
 *
 * @module      :: Model
 * @description :: Languages for use in collection lists
 *
 */

module.exports = {

  attributes: {
  	
  	name:   { type: 'string'},
    short:  { type: 'string'},
    label:  { type: 'string'}
  },

  adapter: 'mongo'

};
