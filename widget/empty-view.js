/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// ==================================================================== *
//   Copyright Xialia.com  2011-2018
//   FILE : ../src/drumee/builtins/widget/empty-view
//   TYPE : 
// ==================================================================== *

//-------------------------------------
//
// Utils.Wrapper
//-------------------------------------
class __empty_view extends Marionette.View {
  static initClass() {
  //   className: "flow-v empty-wrapper"
  //   templateName: "#--empty-view" #_T.modal
  // 
    this.prototype.className = "flow-v empty-wrapper";
    this.prototype.templateName = "#--empty-view";
     //_T.modal
  }
// =================== *
//
// =================== *

// ===========================================================
// initialize
//
// ===========================================================
  initialize() {
    super.initialize();
    this.model.atLeast({
      content: LOCALE.NO_CONTENT});
    if (this.getOption(_a.modelArgs)) {
      return this.model.set(this.getOption(_a.modelArgs));
    }
  }
}
__empty_view.initClass();
    //_dbg "Wrapper", @
module.exports = __empty_view;
