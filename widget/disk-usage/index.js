/* ==================================================================== *
*   Copyright xialia.com  2011-2021
* ==================================================================== */

class ___disk_usage extends LetcBox {


  /**
   * 
   */
  initialize(opt = {}) {
    require('./skin');
    super.initialize(opt);
    this.declareHandlers();
  }

  /**
   * 
   * @param {View} child
   * @param {String} pn
   */
  // onPartReady (child, pn){
  //   switch(pn){
  //     case _a.none:
  //       this.debug("AAA:31", child);
  //       break;
  //     default:
  //       super.onPartReady(child, pn);
  //       this.debug("AAA:35");
  //   }
  // }

  /**
   * Upon DOM refresh, after element actually insterted into DOM
   */
  onDomRefresh() {
    let { plan } = Visitor.get('plan_detail');
    this.plan = plan || 'basic';
    if (this.mget(_a.update)) {
      this.postService({
        service: SERVICE.desk.limit,
        hub_id: Visitor.id
      }, {sync:1}).then((data)=>{
        this.data = data;
        this.feed(require('./skeleton')(this, data));
      })
      return;
    }
    // this.data = Visitor.get('disk');
    // this.debug("AAA:56", this.data, Visitor.get('disk'));
    this.feed(require('./skeleton')(this, Visitor.get('disk')));

  }

  /**
   * User Interaction Evant Handler
   * @param {View} cmd
   * @param {Object} args
   */
  onUiEvent(cmd, args = {}) {
    let service = args.service || cmd.get(_a.service) || cmd.get(_a.name);

    // switch(service){
    //   case  _a.none:
    //     this.debug("Created by kind builder");
    //   break;
    //   default:
    //     this.debug("Created by kind builder");
    //     if(super.onUiEvent) super.onUiEvent(cmd, args)
    // }
  }

}

module.exports = ___disk_usage
