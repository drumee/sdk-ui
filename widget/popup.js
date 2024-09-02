// ==================================================================== *
//   Copyright Xialia.com  2011-2018
//   FILE : ../src/drumee/builtins/widget/popup
//   TYPE : 
// ==================================================================== *

const __created = null;
//-------------------------------------
//
//
//-------------------------------------
class __popup_handler extends Marionette.View {}
//   templateName: _T.wrapper.raw
// 
//   templateName: _T.wrapper.raw
// # ======================================================
// #
// # ======================================================

// # ===========================================================
// # initialize
// #
// # @param [Object] opt
// #
// # ===========================================================
//   initialize:(opt) =>
//     if __created
//       _c.error  "Popup handler is already initialized"
//     __created = @
//     _dbg "POUPU initialize", opt
// # ==================== *
// #
// # ==================== *

// # ===========================================================
// # onDestroy
// #
// # ===========================================================
//   onDestroy: () =>
//     this.warn "Popup handler should never be destroyed"
// # ==================== *
// #
// # ==================== *

// # ===========================================================
// # onDomRefresh
// #
// # ===========================================================
//   onDomRefresh: () =>
//     @_views = []
//     RADIO_BROADCAST.on _e.error, @_error
//     RADIO_BROADCAST.on _e.warn, @_warn
//     RADIO_BROADCAST.on _e.info, @_info
//     RADIO_BROADCAST.on _e.confirm, @_confirm
//     RADIO_BROADCAST.on _e.tooltip, @_tooltip
//     RADIO_BROADCAST.on _e.show, @_show
//     RADIO_BROADCAST.on "loader", @_loader
//     _dbg "Popup", _MSGBUS
//     @modalRegion = @spawnRegion {nodeClass: 'modal-region'}
//     @tooltipsRegion = @spawnRegion
//       nodeClass: 'tooltip'
//       data:
//         anchor:_a.southEst
//         state : _a.closed
// # ==================== *
// #
// # ==================== *

// # ===========================================================
// # _parse
// #
// # @param [Object] arg
// # @param [Object] status=_a.error
// #
// # @return [Object] 
// #
// # ===========================================================
//   _parse: (arg, status=_a.error) =>
//     msg = _LOCALE _INTL.UNREFERENCED_MSG
//     if _.isString(arg)
//       if _INTL[arg]?
//         msg = _LOCALE _INTL[arg]
//       else
//         msg = arg
//       return {content:msg, className:status}
//     if not _.isObject arg
//       {content:msg, className:status}
//     if arg._status_?
//       status = arg._status_
//     else if arg.responseJSON?
//       status = arg.responseJSON['_status_']
//     else
//       status = arg.status
//     status = status
//     switch status
//       when _a.error
//         msg = arg.responseJSON.content || msg
//       when _a.info
//         msg = arg.responseJSON.content || msg
//       when _a.content, _a.message
//         status = _a.info
//         msg = arg.content || msg
//       else
//         status = _a.error
//         if arg.responseText?.match(/^<!DOC/)
//           msg = _LOCALE  _INTL.ERROR_SERVER
//         else
//           msg = arg.responseXHR || arg.statusText || msg
//     return {content:msg, className:status}
// # ==================== *
// #
// # ==================== *

// # ===========================================================
// # _buildOptions
// #
// # @param [Object] xhr
// # @param [Object] status
// # @param [Object] opt
// #
// # @return [Object] 
// #
// # ===========================================================
//   _buildOptions: (xhr, status, opt) =>
//     model = new Backbone.Model()
//     try
//       model.set @_parse(xhr, status)
//     catch
//       model.set
//         content : _LOCALE _INTL.UNKNOWN_ERROR
//         className : _a.error
//     if opt?
//       return opt(model)
//     return require('skeleton/form/popup')(model)
// # ==================== *
// #
// # ==================== *

// # ===========================================================
// # _display
// #
// # @param [Object] view
// #
// # ===========================================================
//   _display: (view) =>
//     view.addListener @
//     if @modalRegion.currentView?
//       @_views.push view
//     else
//       @modalRegion.show view
//     #_dbg "POUPU _display", @_views, @
// # ==================== *
// #
// # ==================== *

// # ===========================================================
// # _error
// #
// # @param [Object] xhr
// #
// # ===========================================================
//   _error: (xhr) =>
//     console.trace()
//     view = new WPP.Form @_buildOptions xhr, _a.error
//     if view.getOption(_a.model)?
//       @_display view
// # ==================== *
// #
// # ==================== *

// # ===========================================================
// # _info
// #
// # @param [Object] xhr
// #
// # ===========================================================
//   _info:(xhr) =>
//     #_dbg "POUPU _info", xhr, @_buildOptions xhr, _a.info
//     view = new WPP.Form @_buildOptions xhr, _a.info
//     @_display view
// # ==================== *
// #
// # ==================== *

// # ===========================================================
// # _warn
// #
// # @param [Object] xhr
// #
// # ===========================================================
//   _warn:(xhr) =>
//     view = new WPP.Form @_buildOptions xhr, _a.info
//     @_display view
// # ==================== *
// #
// # ==================== *

// # ===========================================================
// # _loader
// #
// # @param [Object] xhr
// #
// # @return [Object] 
// #
// # ===========================================================
//   _loader:(xhr) =>
//     _dbg "POUPU _loader", arguments, @
//     if @modalRegion.currentView?
//       @modalRegion.currentView.destroy()
//       if _.isEmpty xhr
//         @modalRegion.$el.attr(_a.data.state, _a.close)
//         return
//     view = new WPP.Form @_buildOptions xhr, _a.info, require('skeleton/form/loader')
//     @_display view
// # ==================== *
// #
// # ==================== *

// # ===========================================================
// # _tooltip
// #
// # @param [Object] args
// # @param [Object] opt
// #
// # @return [Object] 
// #
// # ===========================================================
//   _tooltip:(args, opt) =>
//     if _.isEmpty args
//       @tooltipsRegion.$el.attr _a.data.state, _a.closed
//       return
//     if args.hasOwnProperty(_a.clientId)
//       @tooltipsRegion.show args
//       return
//     @tooltipsRegion.$el.attr _a.data.state, _a.open
//     if _.isObject opt
//       opt = _.pick(opt, _a.size, _a.anchor)
//       for k,v of opt
//         attr["data-#{k}"] = v
//       @tooltipsRegion.$el.attr attr
//     if not @tooltips? or @tooltips.isDestroyed
//       model = new Backbone.Model {content:args}
//       tooltips = require('widget/tooltips')
//       @tooltips = new tooltips
//         content:args
//       @tooltipsRegion.show @tooltips
//     else
//       @tooltips.update args
// # ==================== *
// #
// # ==================== *

// # ===========================================================
// # _show
// #
// # @param [Object] letc
// #
// # ===========================================================
//   _show:(letc) =>
//     wrapper = new WPP_Box_Reader letc
// #    wrapper.on _e.show, ()=>
// #      top = wrapper.children.findByIndex(0)
// #      top.on "child:destroy", ()=>
// #        @modalRegion.$el.attr _a.data.state, _a.closed
//     @modalRegion.$el.attr(_a.data.state, _a.open)
//     @modalRegion.$el.attr(_a.data.justify, _a.center)
//     @modalRegion.show wrapper
// # ==================== *
// #
// # ==================== *

// # ===========================================================
// # _confirm
// #
// # @param [Object] opt
// #
// # @return [Object] 
// #
// # ===========================================================
//   _confirm = (opt)->
//     if _.isEmpty opt
//       _c.error "Options required"
//       return
//     view = new WPP.Form
//       model:@_getModel(opt.content, _a.info)
//       whenYes:opt.whenYes
//       whenNo:opt.whenNo
//       buttons:_a.question
//     @_display view
module.exports = __popup_handler;
