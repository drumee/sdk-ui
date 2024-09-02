class __video_player extends Marionette.View {
  constructor(...args) {
    super(...args);
    this._responsive = this._responsive.bind(this);
    this._onVideoReady = this._onVideoReady.bind(this);
    this._setupButton = this._setupButton.bind(this);
    this.getBbox = this.getBbox.bind(this);
  }

  static initClass() {
    this.prototype.className ="media-video";
    this.prototype.tagName =_K.tag.li;
    this.prototype.geometry = {
      height:260,
      width:460
    };
  }

// ===========================================================
// initialize
//
// @param [Object] opt
//
// ===========================================================
  initialize(opt) {
    const format = this.getOption(_a.format) || _a.card;
    if ((this.model == null)) {
      this.model = new Backbone.Model();
    }
    this.model.set(_a.format, format);
    this._vdoReady = false;
    RADIO_BROADCAST.on(_e.responsive, this._responsive);
    return this.model.atLeast({
      autostart : false,
      mute      : true,
      contentClass : _K.char.empty,
      widgetId      : _.uniqueId("vdo-player-")
    });
  }
// ========================
//
// ========================

// ===========================================================
// onDomRefresh
//
// @param [Object] opt
//
// ===========================================================
  onDomRefresh(opt) {
    //@$el.attr _a.id, @player_id
    return this._setup();
  }
// ========================
//
// ========================

// ===========================================================
// _responsive
//
// @param [Object] w
//
// ===========================================================
  _responsive(w){
    _dbg("_responsive");
    if (this._vdoReady) {
      return this._setup();
    }
  }
// ========================
//
// ========================

// ===========================================================
// _setup
//
// @param [Object] bbox
//
// @return [Object] 
//
// ===========================================================
  _setup(bbox) {
    const box = this.getBbox();
    _dbg("getBbox", box);
    const {
      width
    } = box;
    const {
      height
    } = box;
    const nid = this.model.get(_a.nodeId);
    const oid = this.model.get(_a.ownerId);
    const file = `?api=media.video&nid=${nid}&oid=${oid}&type.mp4`;
    const image = `?api=media.card&nid=${nid}&oid=${oid}`;
    const player = jwplayer(this.get(_a.widgetId));
    if (!_.isFunction(player.setup)) {
      this.warn("Video player not found", this.get(_a.widgetId));
      return;
    }
    player.setup({
      primary: "html5",
      image,
      file,
      type: 'mp4',
      height,
      width,
      controls: true,
      allowscriptaccess: 'always',
      autostart: this.model.get('autostart'),
      mute: this.model.get('mute')
    });
    return jwplayer(this.get(_a.widgetId)).onReady(this._onVideoReady);
  }
// ========================
//
// ========================

// ===========================================================
// _onVideoReady
//
// ===========================================================
  _onVideoReady() {
    $(`#${this.get(_a.widgetId)}_logo`).remove();
    //h = jwplayer(@get(_a.widgetId)).getHeight()
    //w = jwplayer(@get(_a.widgetId)).getWidth()
    //@model.set(_a.height, h)
    //@model.set(_a.width, w)
    _.delay(this._setupButton, 100);
    this.fireEvent(_e.ready);
    this._vdoReady = true;
    return _dbg("_onVideoReady", this);
  }
// ========================
//
// ========================

// ===========================================================
// _setupButton
//
// ===========================================================
  _setupButton() {
    const $button = $(`#${this.get(_a.widgetId)}_display_button`);
    return $button.css({
      background : 'rgba(100,100,100, 0.5)',
      border : '1px solid #333',
      'border-radius' : _K.size.half
    });
  }
// ========================
//
// ========================

// ===========================================================
// getBbox
//
// @param [Object] parent
//
// @return [Object] 
//
// ===========================================================
  getBbox(parent) {
    const s = this.getStyle();
    let {
      height
    } = s;
    if ((height == null)) {
      if (parent != null) {
        ({
          height
        } = parent.getBbox());
      } else {
        height = this.$el.parent().innerHeight();
      }
    }
    let {
      width
    } = s;
    if ((width == null)) {
      if (parent != null) {
        ({
          width
        } = parent.getBbox());
      } else {
        width = this.$el.parent().innerWidth();
      }
    }
    const r = {
      height,
      width
    };
    return r;
  }
}
__video_player.initClass();
module.exports = __video_player;
