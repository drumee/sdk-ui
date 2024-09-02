
const _default_class = "drumee-box confirm-reader";
//-------------------------------------
//
//
//-------------------------------------
class __confirm extends LetcBox {
  constructor(...args) {
    super(...args);
    this._display = this._display.bind(this);
    this._cancel = this._cancel.bind(this);
    this._success = this._success.bind(this);
    this._runCallback = this._runCallback.bind(this);
    this.onUiEvent = this.onUiEvent.bind(this);
  }

  static initClass() {
  //   templateName: _T.wrapper.raw
  //   className : "#{_a.box} confirm-reader"
  // 
  //   behaviorSet PROXY_CORE.behaviors
  // 
  // 
    this.prototype.templateName = _T.wrapper.raw;
    this.prototype.className  = _default_class;
  }
//__behaviorSet: PROXY_CORE.behaviors

// ===========================================================
// initialize
//
// @param [Object] opt
//
// ===========================================================
  initialize(opt) {
    super.initialize(opt);
    return this.model.set(_a.showIn, _a.modal);
  }

// ===========================================================
// onDomRefresh
//
// ===========================================================
  onDomRefresh(){
    //@debug ">2>EEZZ12!! onDomRefresh", @
    console.trace();
    this.declareHandlers(); //s {part:@, ui:@}, {fork:yes, recycle:yes}
    if (_.isEmpty(this.model.get(_a.kids))) {
      const label     = this.model.get(_a.label) || "Do you confirm";
      const question  = this.model.get(_a.question) || "your intention ?";
      this.feed(require('skeleton/popup/confirm')(this, label, question));
    } else {
      this.feed(this.model.get(_a.kids));
    }
    if (this.model.get('placement') != null) {
      const f =()=> {
        return this._placeModal();
      };
      this.waitElement(this.el, f); 
    }

    this.$el.draggable({
      scroll: true,
      handle: ".handle.box",
      appendTo: _a.body,
      containment: _a.window
    });
    return this._handler = this.model.get(_a.handler);
  }

// ===========================================================
// onPartReady
//
// @param [Object] child
// @param [Object] pn
// @param [Object] section
//
// @return [Object] 
//
// ===========================================================
  // onPartReady: (child, pn, section) =>
  //   #@debug ">2>EEZZ12!! onPartReady", child, pn, section, @model.get(_a.vhost)
  //   if section isnt _a.sys
  //     return
  //   switch pn
  //     when _a.overview
  //       home = @model.get(_a.homepage)
  //       #host = @model.get(_a.vhost)
  //       child._display = @_display
  //       if not _.isEmpty home
  //         child.importFrom home, @model.get(_a.vhost)
  //       else
  //         child.fetch "https://factory.drumee.com/page/no-overview"
  //         #child.feed SKL_Note(_a.base, "Pas d'apperçu", {className:"margin-auto padding-10 box-shadow"})

// ===========================================================
// _display
//
// @param [Object] letc
//
// ===========================================================
  _display(letc) {
    const viewbox = this.getPart(_a.overview);
    //@debug ">>23NN _display", viewbox, letc
    const width =  Utils.px(viewbox.$el.width()/.2); // rescale to fit the outer box
    letc.styleOpt = letc.styleOpt || {};
    letc.styleOpt.width = width;
    viewbox.feed(letc);
    const root = viewbox.children.findByIndex(0);
    return root.$el.css({
      transform:  "scale(0.2,0.2)",
      "transform-origin":"left top",
      width
    });
  }

// ===========================================================
// _placeModal
//
// ===========================================================
  // MOVED TO CSS  (src/drumee/skin/global/common --> .context-node)
  _placeModal(){
    let top;
    let maxWidth = 700;
    if (__guard__(this.model.get(_a.styleOpt), x => x[_a.maxWidth]) != null) {
      maxWidth = this.view.get(_a.styleOpt)[_a.maxWidth];
    } else {
      maxWidth = window.innerWidth;
    }
    // width = @view.get(_a.styleOpt)[_a.width]
    // _dbg "width 0405", width
    this.$el.css(_a.width, maxWidth.px());
    this.debug(">>2233_placeModal ", this.$el.height(), maxWidth.px(), this);
    const left = Math.floor((window.innerWidth*.5) - (maxWidth*.5));
    if (Visitor.isMobile()) {
      top = 0;
    } else {
      top = parseInt(router.viewPortHeight*.3);
    }
    return this.$el.css({
      position : _a.absolute,
      top: O,
      left
    });
  }

// ===========================================================
// _cancel
//
// @param [Object] cb
//
// ===========================================================
  _cancel(cb) {
    const cancel = this.model.get(_a.cancel);
    if (cancel != null) {
      return this._runCallback(cancel);
    } else {
      return this._runCallback();
    }
  }

// ===========================================================
// _success
//
// @param [Object] cb
//
// ===========================================================
  _success(cb) {
    this.debug("_success", cb);
    const confirm = this.model.get(_a.confirm);
    if (confirm != null) {
      this._handler.ui.triggerMethod(`${_a.confirm}:${confirm}`, this.model.get(_a.source));
    } else {
      this.triggerHandlers();
    }
    const success = this.model.get(_a.success);
    if (success != null) {
      return this._runCallback(success);
    } else {
      return this._runCallback();
    }
  }

// ===========================================================
// _runCallback
//
// @param [Object] cb
//
// @return [Object] 
//
// ===========================================================
  _runCallback(cb) {
    if (_.isFunction(cb)) {
      cb();
    } else if (_.isString(cb)) {
      if (cb.match(/^\#.+/)) {
        location.hash = cb;
      } else if (cb.match(/^http.+/)) {
        location.href = cb;
      }
    }
    if (this.model.get(_a.persistent)) {
      return;
    }
    if (this.model.get(_a.anim) != null) {
      return this.triggerMethod(_e.close);
    } else {
      return this.destroy();
    }
  }
// ======================================================
//
// ======================================================

// ===========================================================
// onUiEvent
//
// @param [Object] btn
//
// ===========================================================
  onUiEvent(btn) {
    const service = btn.get(_a.service) || btn.get(_a.name);
    this.debug(`menuEvents service =${service}`, btn);
    switch (service) {
      case _a.cancel:
        return this._cancel();
      case _a.success:
        return this._success();
      default: 
        this.model.set(_a.service, service);
        return this.triggerHandlers();
    }
  }
}
__confirm.initClass();
        //@_handler.ui.triggerMethod "#{_a.confirm}:#{confirm}", @model.get(_a.source)
        //this.warn WARNING.method.unprocessed.format service
module.exports = __confirm;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
