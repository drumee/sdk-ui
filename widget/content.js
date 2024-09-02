class utils_content extends Marionette.View {
  constructor(...args) {
    super(...args);
    this.initialize = this.initialize.bind(this);
    this.tagName = this.tagName.bind(this);
    this.onRender = this.onRender.bind(this);
    this._update = this._update.bind(this);
    this.onDomRefresh = this.onDomRefresh.bind(this);
  }

  static initClass() {
    this.prototype.templateName = _T.wrapper.content;
  }
// ======================================================
//
// ======================================================

// ===========================================================
// initialize
//
// @param [Object] opt
//
// ===========================================================
  initialize(opt) {
    super.initialize();
    return this.model.set(this.getOption(_a.modelArgs));
  }
// ======================================================
//
// ======================================================

// ===========================================================
// tagName
//
// @return [Object] 
//
// ===========================================================
  tagName() {
    if (this.getOption(_a.href) != null) {
      return _K.tag.a;
    }
    return _K.tag.div;
  }
// ======================================================
//
// ======================================================

// ===========================================================
// onRender
//
// ===========================================================
  onRender() {
    if (this.getOption(_a.href) != null) {
      return this.$el.attr({
        href: this.getOption(_a.href)});
    }
  }
// ======================================================
//
// ======================================================

// ===========================================================
// _update
//
// @param [Object] opt
//
// ===========================================================
  _update(opt) {
    this.model.set(_a.content, opt);
    return this.render();
  }
// ======================================================
//
// ======================================================

// ===========================================================
// onDomRefresh
//
// ===========================================================
  onDomRefresh(){
    const child = this.getOption(_a.child);
    if (child != null) {
      let reg;
      if (this.contentRegion != null) {
        reg = this.contentRegion;
      } else {
        reg = this.spawnRegion();
      }
      return reg.show(child);
    }
  }
}
utils_content.initClass();
module.exports = utils_content;
