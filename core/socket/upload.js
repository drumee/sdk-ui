// ============================================================ *
//   Copyright Xialia.com  2011-2019
//   FILE : src/drumee/core/backbone/view
//   TYPE :
// ============================================================ *

const PREFIX = "upload:";
const { makeHeaders } = require("core/socket/utils")
/**
 * 
 * @param {*} e 
 * @returns 
 */
function onProgress(e) {
  this.triggerMethod(PREFIX + _e.progress, e);
}

/**
 * 
 * @param {*} e 
 * @returns 
 */
function errorHandler(e) {
  this.triggerMethod(PREFIX + _e.error, e);
}



/**
 * 
 * @param {*} e 
 * @returns 
 */
function onLoadEnd(e) {
  this.triggerMethod(PREFIX + _e.end, e);
  if (e?.srcElement?.responseText) {
    const resp = JSON.parse(e.srcElement.responseText);
    RADIO_MEDIA.trigger(_e.uploaded, resp.data)
  }
  this.destroy();
}


/**
 * 
 * @param {*} e 
 * @returns 
 */
function onLoad(e) {
  this.triggerMethod(PREFIX + _e.load, e);
}


/**
 * 
 * @param {*} e 
 * @returns 
 */
function onTimeout(e) {
  this.triggerMethod(PREFIX + _e.timeout, e);
}

/**
 * 
 * @returns 
 */
function onAbort() {
  this.xhr.abort();
  this.triggerMethod(PREFIX + "abort", e);
}

/**
 * 
 * @returns 
 */
function onReadyStateChange(r) {
  let { target } = r;
  if (target && target.status == 200) {
    try {
      let { responseText, readyState } = target;
      if (readyState == 4) {
        let { data } = JSON.parse(responseText);
        this.triggerMethod(PREFIX + "response", data);
        return;
      }
    } catch (e) {
      this.warn("RESPONSE_PARSE_ERROR", e);
      return;
    }
  }
}


/**
 * @param {any} url - url of backend service
 */
export function uploadFile(file, params) {
  let xhr = new XMLHttpRequest();
  this.xhr = xhr;
  let uploader = xhr.upload || xhr;
  uploader.onabort = onAbort.bind(this);
  uploader.onerror = errorHandler.bind(this);
  uploader.onload = onLoad.bind(this);
  uploader.onloadend = onLoadEnd.bind(this);
  uploader.onprogress = onProgress.bind(this);
  uploader.ontimeout = onTimeout.bind(this);
  xhr.onreadystatechange = onReadyStateChange.bind(this);
  const { svc } = bootstrap();
  let { service } = params;
  if (!service) {
    service = 'media.upload'
  } else {
    delete params.service;
  }
  xhr.open(_a.post, `${svc}${service}`, true);

  const opt = {
    filename: encodeURI(file.name),
    mimetype: file.type,
    filesize: file.size,
    socket_id: this.get(_a.socket_id) || Visitor.get(_a.socket_id),
    ...params
  };

  const _data = JSON.stringify(opt);
  makeHeaders({
    "Content-Type": "application/octet-stream; charset=utf-8",
    "x-param-xia-data": _data
  }, xhr)
  this.verbose(`SENDING FILE`, params, file);
  if (_.isFunction(file.file)) {
    file.file((f) => {
      xhr.send(f);
    })
  } else {
    xhr.send(file);
  }
}

