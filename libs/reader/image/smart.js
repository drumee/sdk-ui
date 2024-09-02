
const Rectangle = require('rectangle-node');
const _default_class = "smart-image drumee-widget";
const { View } = Marionette;

class __image_smart extends View {
  constructor(...args) {
    super(...args);
    this.onDomRefresh = this.onDomRefresh.bind(this);
    this._load = this._load.bind(this);
  }

  static initClass() { //LetcBox
    this.prototype.tagName  = _K.tag.img; 
    this.prototype.nativeClassName  = _default_class;
    this.prototype.figName  = "image_smart";
  }
  
// ===========================================================
//
// ===========================================================
  initialize(opt) {
    super.initialize(opt);
    if (this.mget(_a.nodeId) != null) {
      return this.mset({ 
        low : this.url(_a.thumb),
        high : this.url(_a.orig)
      });
    } else if (this.mget(_a.src)) {
      return this.model.atLeast({
        low  : this.mget(_a.src),
        high : this.mget(_a.src)
      });
    }
  }

// ===========================================================
//
// ===========================================================
  onDomRefresh() {
    this.el.id = this._id; 
    const f = ()=> {
      const r = this.parent.el.getBoundingClientRect();
      this.bbox = new Rectangle(r.x, r.y, r.width, r.height);
      this._load();
      return this.parent.on(_e.scroll, this._load);
    };
    return this.waitElement(this.el, f); 
  }


// ===========================================================
//
// ===========================================================
  _load() {
    const r = this.el.getBoundingClientRect();
    const bbox = new Rectangle(r.x, r.y, r.width, r.height);

    // Load only when the container is visible in the viewport
    if (!bbox.intersection(this.bbox)) {
      return; 
    }
    if (this._loaded != null) {
      return; 
    }

    this.el.dataset.quality = _a.low;
    this.el.src = this.mget(_a.low);
    const url = this.mget(_a.high) || this.mget(_a.src);
    if (url) {
      return this.el.onload  = e=> {
        //this.debug("ZEZEEZEZEZZEZE 62", e);
        this.el.dataset.quality = _a.high; 
        this.el.src = url;
        this._loaded = true;
        if (e.type === _e.load) {
          this.trigger(_e.loaded, this);
          this.el.src = this.mget(_a.high);
          return this.el.onload = null;
        }
      };
    }
  }
}
__image_smart.initClass();
module.exports = __image_smart;