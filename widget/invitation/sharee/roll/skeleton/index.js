const __sharee_roll = function (_ui_) {
  const list = Skeletons.List.Smart({
    flow: _a.vertical,
    sys_pn: "roll-content",
    className: `${_ui_.fig.family}__list`,
    debug: __filename,
    itemsOpt: _ui_.shareeItem,
    spinner: true,
    placeholder: Skeletons.Note(LOCALE.NO_CONTACT, "placeholder--no-contact"),
    api: _ui_.mget(_a.api),
    vendorOpt: Preset.List.Orange_d,
    inspect: 1
  });
  let kids = _ui_.mget(_a.sharees) || [];
  if (!_ui_.mget(_a.api) && kids.length) {
    list.kids = kids;
    // let kids = [];
    // for (let k of _ui_.mget(_a.sharees)) {
    //   kids.push({ ...k, ..._ui_.shareeItem })
    // }
    // if (kids.length) {
    //   list.kids = kids;
    //   delete list.itemsOpt;
    //   delete list.placeholder;
    // }
  }
  const dialog = Skeletons.Wrapper.Y({
    name: "dialog",
    className: `${_ui_.fig.family}__dialog-wrapper`
  });
  _ui_.debug("SLK:13", list, _ui_.mget(_a.sharees), _ui_.mget(_a.api))

  let state = 1;
  const txt = _ui_.label();
  if (_.isEmpty(txt) || (_ui_.mget(_a.mode) === _a.owner)) {
    state = 0;
  }
  const label = Skeletons.Box.X({
    className: `${_ui_.fig.family}__label`,
    kids: [
      Skeletons.Note({
        className: "content",
        sys_pn: "content-label",
        content: txt
      })
    ]
  });

  const a = Skeletons.Box.Y({
    debug: __filename,
    className: `${_ui_.fig.group} ${_ui_.fig.family}__container`,
    kids: [label, list, dialog]
  });
  return a;
};

module.exports = __sharee_roll;
