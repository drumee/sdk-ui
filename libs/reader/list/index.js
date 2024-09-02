const _button = function (id) {
  const html = `<div id=\"${id}-fetch\" class=\"fetch-button\"></div>`;
  return html;
};
const SPINNER_WAIT = 'spinnerWait';

class __list extends LetcBox {

  /**
   * 
   */
  initialize(opt) {
    if (opt.kids && opt.itemsOpt) {
      opt.kids = { ...this.prepare(opt.kids) };
    }
    super.initialize(opt);
    this.declareHandlers();
    this.restart = this.start.bind(this);
    if (_.isEmpty(this.mget(_a.kids))) {
      this._started = false;
    } else {
      this._started = true;
    }

    this.model.atLeast({
      innerClass: _K.char.empty,
      flow: _a.vertical,
      axis: _a.y
    });
    this.model.set(_a.widgetId, this._id);
    if (this.mget(_a.timer)) {
      this._timer = this.mget(_a.timer);
    }

    opt = this.mget(_a.vendorOpt) || {};
    this._startAtBottom = (this.mget(_a.start) || opt.start) === _a.bottom;
    if (this._startAtBottom) {
      opt.star = this._startAt;
      this.mset(_a.vendorOpt, opt);
    }

    const o = this.mget('autoHeight');
    if (o != null) {
      if ((o.min == null)) {
        o.min = 30;
      }
      this._minHeight = o.min;
      this._maxHeight = o.max || 300;
      this._unitHeight = o.unit || this._minHeight;
      this.collection.on(_e.remove, c => {
        if (this.collection.length === 0) {
          return this.el.hide();
        }
      });
    }
    RADIO_BROADCAST.on(_e.responsive, this.responsive.bind(this));
    this._initApi();
  }

  /**
   * 
   */
  onDestroy() {
    this.collection.reset();
    this.stopListening();
    try {
      this.__container.removeEventListener(_e.scroll, this._scrollHandler);
      this.el.onmousewheel = null;
    } catch (e) {

    }
    RADIO_BROADCAST.off(_e.responsive, this.responsive.bind(this));
  }


  /**
  * 
  */
  responsive() {
    /** Do not remove */
  }


  /**
  * 
  */
  scrollHeight() {
    if (!this.__container) return;
    return this.__container.scrollHeight - this.__container.outerHeight();
  }

  /**
   * 
   */
  scrollTop() {
    if (!this.__container) return;
    return this.__container.scrollTop;
  }

  /**
  * 
  */
  scrolledY() {
    if (!this.__container) return;
    return this.__container.scrollHeight - this.__container.outerHeight() - this.__container.scrollTop;
  }

  /**
   * 
   * @returns 
   */
  _initApi() {
    const api = this.mget(_a.api)
    if (!api) {
      this._api = {};
    }
    if (_.isString(api)) {
      this._api = { service: api };
      return;
    }
    if (_.isFunction(api)) {
      this._api = api(this) || {};
      return
    }
    this._api = api || {};
  }

  /**
   * 
   */
  start() {
    this._curPage = 1;
    this._waiting = false; // wait util data received
    this._scrollY = 0;
    this._lastScrollTop = 0;
    this._initApi();
    this.reset();
    this._end_of_data = false;
    let fetched = this.fetch();
    let kids = this.mget(_a.kids)
    if (fetched) return;
    if (kids) {
      this.feed(kids);
    }
    this.trigger(_e.started)
  }

  /**
   * 
   * @param {*} timer 
   * @returns 
   */
  tick(timer) {
    if (_.isNumber(timer)) {
      this._timer = timer;
    }
    if (this._tickRunning) {
      return;
    }

    const list = this.children.toArray();
    var f = () => {
      this._tickRunning = true;
      this._tickCount++;
      if (list[this._tickCount] != null) {
        list[this._tickCount].triggerMethod("tick", this);
      }
      if (this._end_of_data || (this._tickCount > this.collection.length)) {
        this._tickRunning = false;
        return;
      }
      this.fetch();
      setTimeout(f, this._timer);
    };
    return setTimeout(f, this._timer);
  }

  /**
   * 
   */
  initCollectionEvents() {
    if (!this.phContent) return;
    if (this._collectionEventsBound) return;
    this._collectionEventsBound = true;
    this.collection.on(_e.add, () => {
      let ph = this.__placeholder;
      if (ph && !ph.isDestroyed()) {
        ph.cut();
      }
    });
  }

  /**
   * 
   * @returns 
   */
  initContent() {
    const id = `${this._id}-container`;
    const c = document.getElementById(id);
    this.__container = c;
    this.trigger(_e.ready);
    let kids = this.mget(_a.kids) || [];
    if (this._startAtBottom) {
      this.collection.on(_e.update, () => {
        if (this._scrolling) return;
        _.delay(() => {
          c.scrollTop = c.scrollHeight;
        }, 300);
      });
      this.collection.once(_e.update, () => {
        _.delay(() => { this._ready = 1; }, 300);
      });

    } else {
      this._ready = 1;
    }

    this._scrollHandler = _.throttle(this._onScroll.bind(this), 500);
    c.addEventListener(_e.scroll, this._scrollHandler);
    let ph = this.mget(_a.placeholder);
    if (_.isFunction(ph)) {
      this.phContent = ph();
    } else {
      this.phContent = ph;
    }
    if (kids.length) {
      this.initCollectionEvents();
      this.start();
      return
    }
    if (this.phContent) {
      this.append(this.phContent);
      this.__placeholder = this.children.last();
    }
    this.initCollectionEvents();
    this.start();

  }



  /**
   * 
   */
  onDomRefresh() {
    let f;
    this._scrollY = 0;
    this._delta = 0;

    const id = `${this._id}-container`;
    this._scrolling = false;
    this.ensureElement(id)
      .then(this.initContent.bind(this))
      .catch(() => {
        this.warn(`Failed to ensure element id=${id}`)
      })
  }

  /** When the first pages are not long enough to 
   * trigger scroll event we rely on mousewheel event 
   * to get more items
   */
  onMouseWheel() {
    this.el.addEventListener("mousewheel", (e) => {
      if (!this.scrollY && !this._end_of_data) {
        if (this._startAtBottom) {
          if (e.deltaY < 0) this.fetch();
        } else {
          if (e.deltaY > 0) this.fetch();
        }
      }
    }, { passive: true })
  }

  /**
   * 
   */
  changeFlow(f) {
    this.el.dataset.flow = f;
    return this.__container.dataset.flow = f;
  }

  /**
   * mouseenter are sometime lost because the children update 
   * the parent space so, children must bubble the events
   * @returns 
   */
  onChildItemOver() {
    return this.el.mouseenter();
  }


  /**
   * 
   * @param {*} opt 
   */
  getScrollX() {
    return this.__container.scrollLeft;
  }

  /**
   * 
   * @param {*} opt 
   */
  getScrollY(opt) {
    return this.__container.scrollTop;
  }

  /**
   * 
   * @param {*} opt 
   */
  scroll(opt) { }



  /**
   * 
   * @param {*} width 
   * @param {*} height 
   * @param {*} force 
   * @returns 
   */
  setSize(width, height, force) {
    if (force == null) { force = false; }
    if (width != null) {
      this.$el.width(width);
      this.style.set(_a.width, width);
    } else if (/[0-9]+([%|a-z|A-B]+)/.test(this.style.get(_a.width))) {
      this.$el.width(this.style.get(_a.width)); //(width)
    }

    if (height != null) {
      this.$el.height(height);
      return this.style.set(_a.height, height);
    } else if (/[0-9]+([%|a-z|A-B]+)/.test(this.style.get(_a.height))) {
      // if isNumeric @style.get(_a.height)
      // height = parseInt @style.get(_a.height)
      return this.$el.height(this.style.get(_a.height)); //(height)
    }
  }

  /**
   * 
   */
  syncSisze(width, height, force) {
    if (force == null) { force = false; }
    return this.warn("syncSisze IS DEPRECATED!!!");
  }

  /**
   * 
   */
  setOverflow(v) {
    this.el.css(_a.overflow._, v);
    return this.el.parent().css(_a.overflow._, v);
  }

  /**
   * 
   */
  checkSpinner() {
    if (!this.mget(_a.spinner)) {
      return;
    }
    const f = () => {
      const opt = { kind: 'spinner' }
      if (this._startAtBottom) {
        this.prepend(opt);
        this.__spinner = this.children.first();
      } else {
        this.append(opt);
        this.__spinner = this.children.last();
      }
    }
    const tw = this.mget(SPINNER_WAIT);
    if (tw) {
      if (!this._waiting) return;
      this._timeout = setTimeout(f, tw);
    } else {
      f();
    }

  }



  /**
   * 
   */
  fetch() {
    const { service } = this._api;
    if (!service) {
      return;
    }
    if (this._end_of_data || this.isDestroyed()) {
      return;
    }
    let max_page = this.mget(_a.max_page);
    if (max_page && this._curPage > max_page) {
      this._end_of_data = true;
      return;
    }
    if (this._waiting) {
      return { waiting: 1 };
    }
    this._api.page = this._curPage;
    this._waiting = true;
    const opt = { ... this._api };
    if (this.mget(_a.cors) && (this.mget(_a.vhost) != null)) {
      opt.vhost = this.mget(_a.vhost);
    }
    delete opt.service;
    this.checkSpinner();
    this.fetchService(service, opt)
      .then(this.handleResponse.bind(this))
      .catch(this.onServerComplain.bind(this));
    return opt;
  }

  /**
   * 
   */
  _onScroll(e, pos) {
    if (!this.__container) return;
    let dir;
    if (!this._ready || this._waiting) {
      return;
    }
    const st = this.__container.scrollTop;
    this.scrollY = st;
    this.scrollX = this.__container.scrollLeft;
    if (this._scrollY < this.scrollY) {
      dir = _a.down;
    } else if (this._scrollY > this.scrollY) {
      dir = _a.up;
    } else if (this._scrollX < this.scrollX) {
      dir = _a.left;
    } else if (this._scrollX > this.scrollX) {
      dir = _a.right;
    } else {
      return;
    }
    this.scrollDir = dir;
    this._scrolling = true;
    this._scrollY = this.scrollY;
    this._scrollX = this.scrollX;
    this.trigger(_e.scroll, this, e);
    let f = () => {
      this._scrolling = false;
    };
    if (!this._startAtBottom) {
      _.delay(f, 3000);
    }
    if (this._startAtBottom) {
      if ((dir === _a.down) || (st > 0)) {
        return;
      }
    }
    this.fetch();
  }

  /**
   * 
   */
  getOffsetY() {
    if (!this.__container) return;
    return this.__container.scrollTop;
  }

  /**
   * 
   */
  getOffsetX() {
    if (!this.__container) return;
    return this.__container.scrollLeft;
  }

  /**
   * 
   */
  scrollTo(x, y, d) {
    if (!this.__container) return;
    if (x == null) { x = 0; }
    if (y == null) { y = 0; }
    if (d == null) { d = 0.5; }
    return this.__container.scrollTo(x, y);
  }

  /**
   * 
   */
  scrollToBottom(d) {
    if (!this.__container) return;
    const h = this.__container.scrollHeight || this.__container.innerHeight();
    this.__container.scrollTop = h;
  }

  /**
   * 
   */
  scrollToRight(d) {
    if (!this.__container) return;
    if (d == null) { d = 0.5; }
    const h = this.__container.scrollWidth || this.__container.innerWidth();
    return this.__container.scrollTo(0, h);
  }

  /**
   * 
   */
  showAtBottom() { }

  /**
  * @param {any} xhr 
  */
  onServerComplain(xhr) {
    this.warn(`[ERROR:532]GOT SERVER COMPLAINS :`, xhr);
    this.trigger(_e.error, this);
  }


  /**
   * 
   */
  handleResponse(data) {
    this._waiting = false;
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }

    if ((this.__spinner != null) && !this.__spinner.isDestroyed()) {
      this.__spinner.cut();
    }

    if (_.isEmpty(data) && this.phContent) {
      if (this.collection.length === 0) {
        this.collection.cleanSet(this.phContent);
        this.__placeholder = this.children.last();
      }
      return;
    }

    if (this._startAtBottom) {
      if (_.isArray(data)) {
        data = data.reverse();
      }
    }
    if (!_.isArray(data)) {
      this._eod();
      if (this.el != null) {
        this.$el.mouseenter();
      }
      return;
    }

    if (!data.length) {
      this._eod();
      return;
    }

    try {
      this.renderData(data);
    } catch (error) { }


    if ((data[0] != null) && data[0].page) {
      if (data.length < _K.pagelength) {
        this._eod();
        return;
      }
    }

    this._curPage++;
    if (this._timer) this.tick();
  }

  /**
   * 
   */
  _eod() {
    this._end_of_data = true;
    this.trigger(_e.eod, this);
    this.status = _e.eod;
  }

  /**
   * 
   * @param {*} data 
   * @returns 
   */
  renderData(data) {
    if (this._fetchBtn != null) {
      this._fetchBtn.remove();
    }

    this.trigger(_e.data, data);

    if (this._end_of_data) {
      return;
    }

    data = this.prepare(data);
    if (!this._started) {
      if (this.mget(_a.defaults)) {
        const g = () => {
          return this.collection.add(data);
        };
        _.delay(g, 300);
      } else {
        try {
          this.collection.cleanSet(data);
        } catch (e) {
          this.warn(e, data);
        }
      }
      this._started = true;
    } else {
      if (this._startAtBottom) {
        if ((this._curPage > 1) || this.mget(_a.defaults)) {
          this.collection.unshift(data);
        } else {
          this.collection.set(data, { silent: true });
        }
      } else {
        if ((this._curPage > 1) || this.mget(_a.defaults)) {
          this.collection.add(data);
        } else {
          this.collection.cleanSet(data);
        }
      }
    }
    if (this.mget('fetchButton')) {
      this.el.append(_button(this._id));
      this._fetchBtn = document.getElementById(`${this._id}-fetch`);
      const h = () => {
        return this._fetchBtn.onclick = this.fetch;
      };
      return this.waitElement(this._fetchBtn, h);
    }
  }

  /**
   * 
   * @param {*} data 
   * @returns 
   */
  feed(data) {
    let kids = this.prepare(data);
    if (kids) {
      return this.collection.set(kids);
    }
    return this.collection.set(data);
  }

  /**
   * 
   * @param {*} data 
   * @returns 
   */
  prepend(data) {
    this.prepare(data);
    this.collection.unshift(data);
    let c = this.children.first();
    return c;
  }

  /**
   * 
   * @param {*} data 
   * @param {*} index 
   * @returns 
   */
  append(data, index) {
    this.prepare(data);
    let c;
    if (index != null) {
      const c = this.collection.toJSON();
      c.splice(index, 0, data);
      this.collection.cleanSet(c);
      c = this.children.findByIndex(index);
    } else {
      this.collection.add(data);
      c = this.children.last();
    }
    return c;
  }

  /**
   * 
   * @returns 
   */
  getEffectiveLength() {
    const { length } = this.collection;
    return length;
  }
}

module.exports = __list;