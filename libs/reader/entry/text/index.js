const _id_tag        = 'entry-';

//-------------------------------------
//
//-------------------------------------
class __entry_text extends LetcBox {
  constructor(...args) {
    super(...args);
    this.reload = this.reload.bind(this);
    this.onDomRefresh = this.onDomRefresh.bind(this);
    this.onPartReady = this.onPartReady.bind(this);
    this.getData = this.getData.bind(this);
  }

  static initClass() {
    this.prototype.events  = {
      'keyup .note-content'      : 'keyup',
      'click .note-content'  : 'edit'
    };
    this.prototype.figName  = "entry_text";
  
  // ===========================================================
  //
  // ===========================================================
    this.prototype.behaviorSet =
      {socket   : 1};
  }

// ===========================================================
// initialize
//
// @param [Object] opt
//
// ===========================================================
  initialize(opt) {
    super.initialize(opt);
    this.model.atLeast({
      flow        : _a.wrap,
      placeholder : LOCALE.ENTER_TEXT,
      innerClass  : _K.char.empty,
      content     :  this.mget(_a.alt) || this.mget(_a.value)
    });
    this._id = _.uniqueId(_id_tag);
    this.mset({ 
      widgetId : this._id});
    return this.debug("OOOON 200 aa===>", this);
  }
      
// ===========================================================
//
// ===========================================================
  keyup(e){
    e.stopPropagation();
    this.checkPlaceholder();
    return false;
  }

// ===========================================================
//
// ===========================================================
  edit(e){
    if (this.$content[0]) {
      return this.$content[0].dataset.empty = 0;
    }
  }

// ===========================================================
//
// ===========================================================
  reload() {
    this.debug("OOOON 52 aa===>", this);
    return this.feed(Skeletons.Box.Y({
      className : `${this.fig.family} ${this.fig.family}__container`,
      sys_pn    : "ref-content",
      active    : 0,
      handler   : {
        part    : this
      }
    })
    );
  }

// ===========================================================
//
// ===========================================================
  onDomRefresh() {
    this.declareHandlers(); //s({part:@}, {recycle:yes})
    this.debug("OOOON 69 aa===>", this, require('./template/main')(this));
    return this.reload();
  }

// ===========================================================
//
// ===========================================================
  checkPlaceholder(e){
    const v = this.$content.text().trim();
    if (_.isEmpty(v)) { 
      return this.$content[0].dataset.empty = 1;
    } else { 
      return this.$content[0].dataset.empty = 0;
    }
  }


// ===========================================================
//
// ===========================================================
  onPartReady(child, pn, section) {
    this.debug("OOOON 200 aa===>", pn, child, this);
    switch (pn) {
      case "ref-content":
        this.content = child;
        return child.on(_e.show, ()=> {
          child.$el.append(require('./template/main')(this));
          return this.waitElement(this._id, ()=> {
            this.$content = this.$el.find(`#${this._id}`);
            this.checkPlaceholder();
            return this.$content.focus();
          });
        });
    }
  }

// ===========================================================
//
// ===========================================================
  getData(){
    const v = this.$content.text();
    const n = this.mget(_a.name);
    if (n != null) {
      return {name:n, value:v};
    }
    return {value:v};
  }
}
__entry_text.initClass();

// # ===========================================================
// # set
// #
// # @return [Object]
// #
// # ===========================================================
//   set:(opt)=>
//     @mset opt
//     @reload()

// # ===========================================================
// # _onAlsoClick
// #
// # @param [Object] e
// #
// # ===========================================================
//   _onAlsoClick: (e) ->
//     @triggerMethod _e.also.click, e

module.exports = __entry_text;
