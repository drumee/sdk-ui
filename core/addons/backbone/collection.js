/**
 * Hack, Composite collection fire 'show' twice on set
 * @param {*} a 
 * @returns 
 */
Backbone.Collection.prototype.cleanSet = function(a) {
  this.reset();
  return this.add(a);
};

/**
 * 
 * @param {*} a 
 * @returns 
 */
Backbone.Collection.prototype.replace = function(a) {
  this.reset();
  return this.add(a);
};

