/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// ================================================================== *
//   Copyright Xialia.com  2011-2020
//   FILE : /src/drumee/builtins/window/conference/device/skeleton/index.coffee
//   TYPE : Skelton
// ===================================================================**/

const __skl_media_device = function(_ui_) {

  let a;
  return a = [
    Skeletons.Box.X({
      className  : `${_ui_.fig.family}__container`,
      active     : 0,
      kids       : [
        Skeletons.Button.Svg({
          className : `${_ui_.fig.family}__checkbox`,
          state     : _ui_.mget(_a.state),
          active    : 0,
          sys_pn    : "checkbox",
          // partHandler : _ui_
          icons     : [
          //  "box-tags"
          //  "backoffice_checkboxfill"
            "editbox_shapes-roundsquare",
            "available"
          ]}),
        Skeletons.Note({
          className : `${_ui_.fig.family}__label`,
          content   : _ui_.mget(_a.name),
          active    : 0
        })
      ]})
  ];
};


module.exports = __skl_media_device;