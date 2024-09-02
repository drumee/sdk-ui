
require('yuki-createjs');
const { isNumeric, fitBoxes, capFirst } = require("core/utils")

createjs.Graphics.Polygon = function(x, y, points) {
  this.x = x;
  this.y = y;
  return this.points = points;
};

createjs.Graphics.Polygon.prototype.exec = function(ctx) {
  //Start at the end to simplify loop
  const end = this.points[this.points.length - 1];
  ctx.moveTo(end.x, end.y);
  return this.points.forEach(point => ctx.lineTo(point.x, point.y));
};

createjs.Graphics.prototype.drawPolygon = function(x, y, args) {
  const points = [];
  if (Array.isArray(args)) {
    args.forEach(function(point){
      let p;
      if (Array.isArray(point)) {
        p = {x:point[0], y:point[1]};
      } else {
        p = point;
      }
      return points.push(p);
    });
  } else {
    args = Array.prototype.slice.call(arguments).slice(2);
    let px = null;
    args.forEach(function(val) {
      if (px === null) { 
        return px = val;
      } else {
        points.push({x: px, y: val});
        return px = null;
      }
    });
  }
  return this.append(new createjs.Graphics.Polygon(x, y, points));
};


// ===========================================================
// _canvas
// Builds the frame box for the widget
// @param [Object] id
// @param [Object] variant
//
// @return [String] HTML string that represents the canvas box of the widget (inner box)
//
// ===========================================================
const _canvas = function(v){
  const id  = v.model.get(_a.widgetId);
  const w   = v._viewportWidth;
  const h   = v._viewportHeight;
  const src = v._url();
  //html = "<canvas id=\"#{id}\" width=\"#{w}\" height=\"#{h}\" class=\"canvas-box\"></canvas>"
  const html = `<div id=\"${id}-wrapper\" class=\"image-wrapper\"> \
<canvas id=\"${id}\" width=\"${w}\" height=\"${h}\" class=\"canvas-box\"></canvas> \
<img id=\"${id}-img\" style=\"z-index:-10;\" src=\"${src}\" class=\"img-box\"> \
</img> \
</div>`;
  return html;
};

const _show_file_path = function(view){
  const html = `<div style=\"position :aboslute; top:0; left:0 \"> \
${view.image.get('parent_path') + '/' + view.image.get('filename')} \
</div>`;
  return html;
};

// ===========================================================
// _message
// 
// @param [Object] id
// @param [Object] variant
//
// @return [String] HTML string that represents the div box of the widget (inner box)
//
// ===========================================================
const _message = function(id, msg){
  const html = `<div id=\"msg-${id}\" class=\"fill-up\">${msg}</div>`;
  return html;
};


class __photo extends LetcBox {
  constructor(...args) {
    this.onPartReady = this.onPartReady.bind(this);
    this.guessFormat = this.guessFormat.bind(this);
    this._url = this._url.bind(this);
    this._loadImage = this._loadImage.bind(this);
    this._stop = this._stop.bind(this);
    this._start = this._start.bind(this);
    this.mould = this.mould.bind(this);
    this.update = this.update.bind(this);
    this.clearLoaders = this.clearLoaders.bind(this);
    this.display = this.display.bind(this);
    this._setupDefault = this._setupDefault.bind(this);
    this._cook = this._cook.bind(this);
    this._shape = this._shape.bind(this);
    this._getBoudingBox = this._getBoudingBox.bind(this);
    this._getShapeOpt = this._getShapeOpt.bind(this);
    super(...args);
  }

  static initClass() {
    this.prototype.className = "widget photo";
  }

// ===========================================================
// initialize
//
// @param [Object] opt
//
// ===========================================================
  initialize(opt) {
    this.model.atLeast({
      innerClass : ""});
    super.initialize(opt);

    this._countdown = _.after(3, ()=> {
      return this._start();
    });

    this.image = new Backbone.Model(this.model.get(_a.imageOpt));
    if (_.isEmpty(this._url())) {
      this.warn(WARNING.attribute.required.format('url'));
      this._countdown();
      this._countdown();
    }

    this.declareHandlers();
    this.transform = new Backbone.Model(this.model.get(_a.transformOpt));

    this.options.spinner = _a.off;
    this.model.set({
      widgetId : _.uniqueId('canvas-')});
    this.preset();
    this.natural = new window.Image();
    this._loadImage();
    this._filters = {};
    return this._zoom    = this.image.get(_a.zoom) || 1;
  }
    //@debug "AEAEZEZRRZRZ 111.... initialize",  @model.get(_a.cookOpt)


// ===========================================================
// onPartReady
//
// @param [Object] child
// @param [Object] pn
// @param [Object] section
//
// ===========================================================
  onPartReady(child, pn, section) {
    //@debug ">>2233AAAA CHILD READY WIDGET HHGG", pn, child, @
    // Awfull hack, sorry :(
    // We need to get children from parts such as hover,...
    //child._serialize = PROXY_CORE.serialize
    this[`_${pn}`] = child;
    switch (pn) {
      case _a.loader:
        return child.feed(require('skeleton/spinner/circles')());
    }
  }



// ===========================================================
// onDomRefresh
//
// ===========================================================
  onDomRefresh() {
    this.feed(require('skeleton/photo')(this));
    this._viewportWidth  = Math.round(this.$el.width());
    this._viewportHeight = Math.round(this.$el.height());
    this.$el.append(_canvas(this));
    this.canvasEl = document.getElementById(this.model.get(_a.widgetId));
    const f =()=> {
      // radius = parseInt @getActualStyle().borderRadius.split(' ')
      // if radius.length is 1
      //   br = parseInt radius[0]
      //   bw = parseInt @getActualStyle().borderWidth
      //   $("##{@model.get(_a.widgetId)}-wrapper").css 
      //     borderRadius : (br - bw)
      // else
      //   b = ['borderRightWidth']
      //   for r in radius
      //     br = parseInt radius[0]
      //     bw = parseInt @getActualStyle().borderWidth
      //     $("##{@model.get(_a.widgetId)}-wrapper").css 
      //       borderRadius : (br - bw)

      // _dbg "AEAEZEZRRZRZ AAAAAAAAAAAA", br, bw, "##{@model.get(_a.widgetId)}-wrapper"
      return this._countdown();
    };
    this.waitElement(this.canvasEl, f); //@createCanvas

    //@imageEl  = document.getElementById "#{@model.get(_a.widgetId)}-img"
    const me = this;
    const g = () => me._countdown();
    //this.waitElement @imageEl, g
    this.waitElement(this.el, g);

    if ((typeof __BUILD__ !== 'undefined' && __BUILD__ !== null) && ['dev', 'testing', 'snapshot'].includes(__BUILD__)) {
      const fname = this.image.get('parent_path') + '/' + this.image.get('filename');
      return this.$el.attr(_a.title, fname);
    }
  }

    // When file is already in cache, wait a while before starting
    //_.delay @_countdown, 50
    // g =()=>
    //   @_countdown()
    // this.waitElement @canvasEl, g #@createCanvas

// ===========================================================
// createCanvas
//
// ===========================================================
  // createCanvas: () =>
  //   @_viewportWidth  = @$el.width()
  //   @_viewportHeight = @$el.height()
  //   #@debug "START AAAAQQ _countdown onDomRefresh", @_viewportWidth, @_viewportHeight, @
  //   @$el.append _canvas(@model.get(_a.widgetId), @_viewportWidth, @_viewportHeight)
  //   @canvasEl = document.getElementById @model.get(_a.widgetId)

// ===========================================================
// guessFormat
//
// ===========================================================
  guessFormat() {
    let format, h, w;
    if (this._isShown) {
      w = this.$el.width();
      h = this.$el.height(); //
    } else {
      w = this.style.get(_a.width);
      h = this.style.get(_a.height);
    }
    //format = @model.get(_a.format) || _a.slide
    if ((w < 500) || (h < 500)) {
      format = _a.thumb;
    } else if ((w >900) || (h > 650)) {
      format = _a.orig;
    } else { 
      format = _a.slide;
    }
    return format;
  }

// ===========================================================
// _url
//
// ===========================================================
  _url() {
    if (this.mget(_a.url)) {
      return this.mget(_a.url);
    }
    if (this.image.isEmpty() && this.model.get(_a.nodeId)) {
      for (var i of [_a.nodeId, _a.filetype, _a.ownerId, _a.vhost]) {
        this.image.set(i, this.model.get(i));
      }
    }
    //@debug "ZEZZEZEZEZEZEZEZE", @style, @style.get(_a.width), @style.get(_a.height)
    //return require('options/url/link')(@image, _a.orig)
    if (this.model.get(_a.format) != null) {
      return require('options/url/link')(this.image, this.model.get(_a.format));
    }
    return require('options/url/link')(this.image, this.guessFormat());
  }

// ===========================================================
// _loadImage
//
// ===========================================================
  _loadImage() {
    //f = ()=>
      //@debug "START AAAAQQ _countdown _loadImage", @_url(), @
    //  @_countdown()
    this.natural.onload  = this._countdown;
    this.natural.onerror = e=> {
      return this._stop(e); 
    };
    return this.natural.setAttribute(_a.src, this._url());
  }

// ===========================================================
// preset
//
// ===========================================================
  preset(refresh) {
    if (refresh == null) { refresh = false; }
    this._minWidth = 200;
    return this.model.set({
      date     : Dayjs.unix(this.image.get(_a.createTime)).format("DD-MM-YYYY à HH:MM")});
  }

// ===========================================================
// _stop
//
// ===========================================================
  _stop(e) {
    console.trace();
    this.debug("AEAEZEZRRZRZ RZEZEZZETTETE   _stop ", e, this);
    this.$el.append(_message(this._id, `Failed to load from URL *${this._url()}*`));
    return this.clearLoaders();
  }


// ===========================================================
// _start
//
// ===========================================================
  _start() {
    //@debug "START AAAAQQ _countdown _start", @_url(), @
    // if @image.get(_a.width)? and @image.get(_a.height)?
    //   @size = 
    //     width  : @image.get(_a.width)
    //     height : @image.get(_a.height)
    // else
    this.size = {};
    if (isNumeric(this.style.get(_a.width))) {
      this.size.width = Math.floor(this.style.get(_a.width));
    } else {
      this.size.width = Math.floor(this.el.style.width);
    }

    if (isNumeric(this.style.get(_a.height))) {
      this.size.height = Math.floor(this.style.get(_a.height));
    } else {
      this.size.height = Math.floor(this.el.style.height);
    }
          
    this.stage = new createjs.Stage(this.model.get(_a.widgetId));
    this.cook = new Backbone.Model(this.model.get(_a.cookOpt));
    this.display();
    return this._countdown = null;
  }

    // Refresh interact behavior
    //@triggerMethod(_e.restart)
    // if @imageEl?
    //   @imageEl.setAttribute _a.src,@_url()

// ===========================================================
// mould
//
// ===========================================================
  mould(cmd) {
    //@debug "sskkkkkkkkkkkkssssssssss"
    if (cmd) {
      if (cmd.model) {
        this.image.set(_.clone(cmd.model.toJSON()));
      } else {
        this.image.set(_.clone(cmd));
      }
    }

    this.preset();
    this._countdown = _.after(1, this.display);
    return this._loadImage();
  }

// ===========================================================
// update
//
// ===========================================================
  update(cmd) {
    this.b0.filters = [];
    for (var k in this._filters) {
      var v = this._filters[k];
      this.b0.filters.push(v);
    }
    this.b0.cache(0, 0, this.natural.width, this.natural.height);
    // offsetX = @transform.get('offsetX')
    // offsetY = @transform.get('offsetY')
    // if @transform.get('offsetX')?
    // @stage.x = @stage.x + offsetX
    // @stage.y = @stage.y + offsetY
    return this.stage.update();  // raises error when run after upload...? 
  }

// ===========================================================
// update
//
// ===========================================================
  clearLoaders(cmd) {
    return this.children.each(function(c){
      if (c.model.get(_a.sys_pn) === _a.loader) {
        c.clear();
        return c.el.dataset.state = _a.closed;
      }
    });
  }

// ===========================================================
// display
//
// ===========================================================
  display() {
    this.clearLoaders();
    this.stage.removeAllChildren();
    // Layout 0  -> wraps the image in reader mode
    this.l0 = new createjs.Container();

    // Image 0   -> the image in reader mode
    this.b0 = new createjs.Bitmap(this._url()); 

    //bbox = @model.get(_a.crop)
    if (this.transform.isEmpty()) {
      //@debug "KKSJSDHdDHDH _setupDefault", @size, @canvasEl, @natural.width
      this.stage.x=0;
      this.stage.y=0;
      this._setupDefault();
    } else { 
      //@debug "KKSJSDHdDHDH use transform", @size, @canvasEl, @$el.width(), @natural.width
      // if @transform.get(_a.scale)  # Scaling / natural
      //   @b0.scaleX = @transform.get(_a.scale).x
      //   @b0.scaleY = @transform.get(_a.scale).y
      if (this.transform.get(_a.stage)) {  // Scaling / natural
        this.stage.set(this.transform.get(_a.stage));
        this.b0.scaleX = this.$el.width()/this.natural.width;
        this.b0.scaleY = this.$el.height()/this.natural.height;
      }
      if (this.transform.get(_a.container)) {   // Crop rectange position on the stage
        this.l0.set(this.transform.get(_a.container));
      }
      if (this.transform.get(_a.image)) { // Image position / container ??
        this.b0.set(this.transform.get(_a.image));
      }
      this.$el.width(this.size.width);
      this.$el.height(this.size.height);
      if (this.canvasEl) {
        this.canvasEl.width = this.size.width;
        this.canvasEl.height = this.size.height;
      }
    }
      //@style.set @size
        // width  : @size.width
        // height : @size.height
        // left   : parseInt(@style.get(_a.left)) - @l0.x
        // top    : parseInt(@style.get(_a.top)) - @l0.y

    this.l0.addChild(this.b0);
    this.stage.addChild(this.l0);
    this._cook();
    return this.update();
  }
    // if bbox?
    //   @stage.x = - bbox.x 
    //   @stage.y = - bbox.y 
      
    //   o = @model.get('offset')
    //   if o?
    //     @stage.x = o.x 
    //     @stage.y = o.y
    //     @debug "ZZSSS MOVING OOOOOOO", o
    //   @l0.set @model.get('layoutMatrix')
    //   @b0.set @model.get('imageMatrix')
    //   @stage.set @model.get('stageMatrix')
    //   if @model.get(_a.sizing) is _a.none
    //     @b0.scaleX = bbox.w/@natural.width
    //     @b0.scaleY = bbox.h/@natural.height
    //   # else
    //   #   if @model.get(_a.scaleX)
    //   #     @b0.scaleX = @model.get(_a.scaleX)
    //   #   if @model.get(_a.scaleY)
    //   #     @b0.scaleY = @model.get(_a.scaleY)
    //   @size =
    //     width  : bbox.w
    //     height : bbox.h
    //   @size.width = Math.round(@size.width)
    //   @size.height = Math.round(@size.height)
    //   @canvasEl.width = @size.width
    //   @canvasEl.height = @size.height
    //   @$el.width @size.width
    //   @$el.height @size.height
    // else
    // @l0.addChild(@b0)
    // # # if @cook.get('layout')
    // # #   _.merge @l0, @cook.get('layout')
    // # #   # ol = @cook.get('layoutMatrix')
    // # #   # ml = new createjs.Matrix2D()
    // # #   # ml.setValues(ol.a, ol.b, ol.c, ol.d, ol.tx, ol.tx)
    // # #   # @l0.transformMatrix = ml
    // # # else
    // # #   @l0.x = @model.get(_a.x) || 0
    // # #   @l0.y = @model.get(_a.y) || 0
    // # if @cook.get('image')
    // #   _.merge @b0, @cook.get('imageMatrix')
    // #   # mi = new createjs.Matrix2D()
    // #   # mi.setValues(oi.a, oi.b, oi.c, oi.d, oi.tx, oi.tx)
    // #   # @l0.transformMatrix = mi
    // # else
    // #@_setupDefault()

// ========================
// scale = ratio between the natural image size and the reference cropping image @natural
// zoom  = ratio between the cropping size (canvas) and the image size place in the draft
// ========================

// ===========================================================
// _setupDefault
//
// ===========================================================
  _setupDefault() {
    //zoom     = @image.get(_a.zoom)   || 1
    const width      = this.style.get(_a.width) || this.$el.width();
    const height     = this.style.get(_a.height) || this.$el.height();
    this._scaleX   = width/this.natural.width;
    this._scaleY   = height/this.natural.height;
    const sizing     = this.model.get(_a.sizing) || _a.contain;

    switch (sizing) {
      case _a.cover:
        this._scaleX = (this._scaleY = Math.max(this._scaleX, this._scaleY));
        this._innerSize = {
          width  : this._scaleX * this.natural.width,
          height : this._scaleY * this.natural.height
        };
        break;

      case 'fit':
        var outer = {width, height};
        var inner = {width:this.natural.width, height:this.natural.height};
        this._innerSize = fitBoxes(outer, inner);
        this._scaleX = this._innerSize.width/this.natural.width;
        this._scaleY = this._innerSize.height/this.natural.height;
        break;
          
      case _a.contain:
        this._scaleX = (this._scaleY = Math.min(this._scaleX, this._scaleY));
        this._innerSize = {
          width  : this._scaleX * this.natural.width,
          height : this._scaleY * this.natural.height
        };
        break;

      case _a.bound:
        var scale = Math.min(this._scaleX, this._scaleY);
        if ((scale * this.natural.width) < this._minWidth) {
          scale = this._minWidth/this.natural.width;
        }
        this._scaleX = (this._scaleY = scale);
        this._innerSize = {
          width  : this._scaleX * this.natural.width,
          height : this._scaleY * this.natural.height
        };
        break;

      case _a.auto:
        this._scaleX   = this._viewportWidth/this.natural.width;
        this._scaleY   = this._viewportHeight/this.natural.height;
        this._scaleX = (this._scaleY = Math.min(this._scaleX, this._scaleY));
        this._innerSize = {
          width  : this._viewportWidth  - 1, //width - 1
          height : this._viewportHeight - 1 //height - 1
        };
        break;

      default:
        this._scaleX = this.size.width/this.natural.width;
        this._scaleY = this.size.height/this.natural.height;
    }
        // @_innerSize =
        //   width  : @_scaleX * @natural.width
        //   height : @_scaleY * @natural.height
        // if @_innerSize.width > width
        //   r = width / @_innerSize.width
        //   @_innerSize.width = width
        //   @b0.scaleX = @_scaleX * r * @_zoom

        // if @_innerSize.height > height
        //   r = height / @_innerSize.height
        //   @_innerSize.height = height
        //   @b0.scaleY = @_scaleY * r * @_zoom

    this.b0.scaleX = this._scaleX * this._zoom;
    this.b0.scaleY = this._scaleY * this._zoom;
    
    
    this._innerSize.width = Math.round(this._innerSize.width);
    this._innerSize.height = Math.round(this._innerSize.height);
    //@debug "KKSJSDHdDHDH ZsZZZ", @_innerSize, @canvasEl
    this.$el.width(this._innerSize.width);
    this.$el.height(this._innerSize.height);
    if (this.canvasEl) {
      this.canvasEl.width = this._innerSize.width;
      return this.canvasEl.height = this._innerSize.height;
    }
  }
      //@style.set @_innerSize


// ===========================================================
// _cook
//
// ===========================================================
  _cook() {
    if ((this.cook == null)) {
      return;
    }
    //alpha = @cook.get(_a.alpha) || 1
    //rgba = "rgba(0, 0, 0, #{alpha})"
    //@_g = @shape.graphics.beginFill(rgba)
    this.b0.filters = [];

    //@debug "JSHSHSHS, cook ->", @
    
    return (() => {
      const result = [];
      const object = this.cook.toJSON();
      for (var k in object) {
        var v = object[k];
        try { 
          result.push(this[`_${k}`](v));
          // @_g.drawRect(0, 0, @size.width, @size.height)
          // @shape.cache(0, 0, @size.width, @size.height)
          // @b0.cache(0, 0, @size.width, @size.height)
        } catch (e) {
          result.push(this.warn("Failed to cook", e));
        }
      }
      return result;
    })();
  }

// ===========================================================
// _alpha
// run through cookOpt
// ===========================================================
  _alpha(value) {
    //@debug "JSHSHSHS,  alph -> ", value
    const shape = new createjs.Shape();
    const alpha = ((100 - value)/100).toFixed(2);
    const rgba = `rgba(0, 0, 0, ${alpha})`;
    shape.graphics.beginFill(rgba);
    shape.graphics.drawRect(0, 0, this.natural.width, this.natural.height);
    shape.cache(0, 0, this.natural.width, this.natural.height);
    //@b0.filters.push(new createjs.AlphaMaskFilter(shape.cacheCanvas))
    //@b0.cache(0, 0, @natural.width, @natural.height)
    return this._filters.alpha = new createjs.AlphaMaskFilter(shape.cacheCanvas);
  }

// ===========================================================
// _blur
// run through cookOpt
// ===========================================================
  _blur(opt) {
    if (!_.isObject(opt)) {
      opt =  {};
    }
    //@debug "JSHSHSHS, blur -> rgba=#{@_rgba}", opt
    const rx = opt.ry || 0;
    const ry = opt.rx || 0;
    const q  = opt.quality || 1;

    return this._filters.blur = new createjs.BlurFilter(rx, rx, q);
  }
    
    //@b0.filters.push(new createjs.BlurFilter(rx, rx, q))
    //@b0.cache(0, 0, @natural.width, @natural.height)

// ===========================================================
// _colorMatrix
//
// ===========================================================
  _colorMatrix(opt) {
    //@debug "JSHSHSHS, _colorMatrix_rgba}", opt
    const matrix = new createjs.ColorMatrix();
    for (var k in opt) {
      // switch k
      //   when _a.brightness
      //     v = v * 5 - 255

      //   when _a.contrast
      //     v = v * 2 - 100

      var v = opt[k];
      var m = `adjust${capFirst(k)}`;
      try {
        matrix[m](v);
      } catch (e) {
        this.warn(`Failed to apply ${m} on matrix`);
      }
    }
    return this._filters.colorMatrix = new createjs.ColorMatrixFilter(matrix);
  }
    //@b0.filters.push = (new createjs.ColorMatrixFilter(matrix))
    //@b0.cache(0, 0, @natural.width, @natural.height)

// ===========================================================
// _color
// see https://createjs.com/docs/easeljs/classes/ColorFilter.html
// Lowercase  => Multiplier 
// Uppercases => Offset
// ===========================================================
  _color(opt) {
    //@debug "JSHSHSHS, _colorMatrix_rgba}", opt
    let r;
    const matrix = new createjs.ColorFilter();
    const multiplier = 
    (r = opt.r || 1);
    const g = opt.g || 1;
    const b = opt.b || 1;
    const a = opt.a || 1;
    const R = opt.R || 1;
    const G = opt.G || 1;
    const B = opt.B || 1;
    return this._filters.color = new createjs.ColorFilter(r, g, b, a, R, G, B);
  }
    // @b0.filters.push(new createjs.ColorFilter(r, g, b, a, R, G, B))
    // @b0.cache(0, 0, @natural.width, @natural.height)

// ===========================================================
// _shape
//
// @param [Object] 
//
// ===========================================================
  _shape(opt){
    let angle, ps;
    this._mask = new createjs.Shape();
    const g = this._mask.graphics.beginFill("rgba(0, 0, 0, 1)");
    let radius = 0;
    opt = this._getShapeOpt(opt.name);
    switch (opt.name) {
      case 'circle':
        this._maskCmd = g.drawCircle(opt.x, opt.y, opt.radius).command;
        break;

      case 'polystar':
        var sides = opt.sides || 6;
        radius = opt.radius || Math.min(opt.w/2, opt.h/2);
        if ((opt.pointSize == null)) {
          ps =0.6;
        } else {
          ps = opt.pointSize;
        }
        if ((opt.angle == null)) {
          angle = -90;
        } else {
          ({
            angle
          } = opt);
        }
        this._maskCmd = g.drawPolyStar(opt.x, opt.y, radius, sides, ps, angle).command;
        break;

      case 'ellipse':
        this._maskCmd = g.drawEllipse(opt.x, opt.y, opt.w, opt.h).command;
        break;

      case 'roundrect':
        radius = opt.radius || 10;
        this._maskCmd = g.drawRoundRect(opt.x, opt.y, opt.w, opt.h, radius).command;
        break;

      default: 
        this._maskCmd = g.drawRect(opt.x, opt.y, opt.w, opt.h).command;
    }
    this._mask.cache(0, 0, this.natural.width, this.natural.height);    
    //@debug "KKSJSDHDHDH", opt.name, opt, @_maskCmd, @_scaleX, @_scaleY, @
    //@b0.mask = @_mask
    return this._filters.shape = new createjs.AlphaMaskFilter(this._mask.cacheCanvas);
  }


// ===========================================================
// _getCropRect
//
// @param [Object] changed
//
// ===========================================================
  _getBoudingBox(){
    const bounds = {
      x : 0,
      y : 0,
      w : this._viewportWidth,
      h : this._viewportHeight
    };
    if (!_.isEmpty(this.cook.get(_a.crop))) {
      _.merge(bounds, this.cook.get(_a.crop));
    }
    return bounds;
  }

// ===========================================================
// _getShapeOpt
//
// @param [Object] name
//
// ===========================================================
  _getShapeOpt(name){
    let opt;
    const scaleX = this.transform.get(_a.scaleX) || 1;
    const scaleY = this.transform.get(_a.scaleY) || 1;
    let w = this.natural.width;
    let h = this.natural.height;
    let x = 0;
    let y = 0;
    const image = this.transform.get(_a.image);
    // mtx = @model.get('imageMatrix')
    // bbox = @model.get(_a.crop)
    if (image != null) {
      x = (-image.x/image.scaleX) + (image.x * (scaleX - 1)); //(bbox.x)/mtx.scaleX 
      y = (-image.y/image.scaleY) + (image.y * (scaleY - 1));//(bbox.y)/mtx.scaleY 
      //x = x*zoomX
      //y = y*zoomY
      //w = parseInt(@style.get(_a.width))/image.scaleX
      //h = parseInt(@style.get(_a.height))/image.scaleY
      //w = bbox.w/mtx.scaleX
      //h = bbox.h/mtx.scaleX
    } else {
      x = 0;
      y = 0;
    }
    
    switch (name) {    
      case 'circle': case 'polystar':
        w = w * scaleX;
        h = h * scaleY;
        // if image?
        //   x      = x + w*scaleX/2
        //   y      = y + h*scaleY/2
        //   radius = Math.min(w*scaleX/2, h*scaleY/2)
        // else
        x      = x + (w/2);
        y      = y + (h/2);
        var radius = Math.min(w/2, h/2);

        opt = { 
          x,
          y,
          w,
          h,
          radius
        };
        break;
      default:
        opt = { 
          x,
          y,
          w,
          h
        };
    }
    if (this.cook.get(_a.shape) != null) {
      _.merge(opt, this.cook.get(_a.shape));
    }
    //@debug "HHSSGSGSGS MTX", opt, x, y, w, h
    return opt;
  }
}
__photo.initClass();

// ===========================================================
// _filter
//
// ===========================================================
//  _filter: () ->
//    w = @model.get(_a.width)
//    h = @model.get(_a.height)
//    filter = @model.get(_a.filter)
//    shape = new createjs.Shape()
//    if filter.alpha?
//      rgba = "rgba(0, 0, 0, #{filter.alpha})"
//    else
//      rgba = "rgba(0, 0, 0, 1)"
//    @debug "JSHSHSHS, rgba=#{rgba}", filter
//    g = shape.graphics.beginFill(rgba)
//    filters = []
//    if filter.shape
//      x = w/2
//      y = h/2
//      r = Math.min(x, y)
//      switch filter.shape.name
//        when 'Circle'
//          g.drawCircle(x, y, r)
//        when 'RoundRect'
//          radius = filter.shape.radius || 5
//          g.drawRoundRect(x, y, w, h, radius)
//        when 'Ellipse'
//          g.drawEllipse(0, 0, w, h)
//        when 'PolyStar'
//          sides = filter.shape.sides || 6
//          ps    = filter.shape.pointSize || 0.6
//          angle = filter.shape.angle || -90
//          @debug "RZRZRZRZ", filter
//          g.drawPolyStar(x, y, r, sides, ps, angle)
//          #g.drawPolyStar(x, y, r, 6, 0, 30)
//        else
//          g.drawRect(0, 0, w, h)
//    else
//      g.drawRect(0, 0, w, h)
//    shape.cache(0, 0, w, h)
//    filters.push(new createjs.AlphaMaskFilter(shape.cacheCanvas))
//    @b0.filters = filters
//    @b0.cache(0, 0, w, h)
//    if opt
//      rx = opt.ry || 5
//      ry = opt.rx || 5
//      q  = opt.quality || 1
//      shape.cache(0, 0, w, h)
//      filters.push(new createjs.BlurFilter(rx, rx, q))
//      @b0.filters = filters
//      @b0.cache(0, 0, w, h)
//# ========================
//#
//# ========================


// ===========================================================
// #  _filterAA
//
// ===========================================================
//  _filterAA: () ->
//    w = @model.get(_a.width)
//    h = @model.get(_a.height)
//
//    filter = @model.get(_a.filter)
//    filters = []
//    x = w/2
//    y = h/2
//    r = Math.min(x, y)
//    shape = new createjs.Shape()
//    g = shape.graphics.beginFill("rgba(0, 0, 0, 0.3)")
//    #g.drawCircle(x, y, r)
//    g.drawRect(0, 0, w, h)
//    shape.cache(0, 0, w, h)
//    filters.push(new createjs.AlphaMaskFilter(shape.cacheCanvas))
//    @b0.filters = filters
//    @b0.cache(0, 0, w, h)
module.exports = __photo;
