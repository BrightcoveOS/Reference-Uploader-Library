var ParamParser = require('./param-parser');
var postJson = require('./post-json');
var VideoUpload = require('./video-upload');

var noop = function(){};

function BCUploader(params) {
  // Protect against forgetting the new keyword when instantiating objects
  if (!(this instanceof BCUploader)) {
    return new BCUploader(params);
  }

  var param = ParamParser('BCUploader', params);

  // required parameters
  this.createVideoEndpoint = param.required('createVideoEndpoint');
  this.signUploadEndpoint = param.required('signUploadEndpoint');
  this.ingestUploadEndpoint = param.required('ingestUploadEndpoint');
  this.root = param.required('root');

  // optional callbacks
  this.onProgress = param.optional('onProgress', noop);
  this.onStarted =  param.optional('onStarted', noop);
  this.onComplete =  param.optional('onComplete', noop);
  this.onUploadInitiated =  param.optional('onUploadInitiated', noop);
  this.onError =  param.optional('onError', noop);

  // and so it begins...
  this.setupDom();
}

BCUploader.prototype.createVideo = function createVideo(fileName) {
  return postJson(this.createVideoEndpoint, {name: fileName});
};

BCUploader.prototype.setupDom = function setupDom() {
  var form = document.createElement('form');
  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.onchange = this.onFileSelected.bind(this);
  form.appendChild(fileInput);
  document.getElementById(this.root).appendChild(form);
};

BCUploader.prototype.onFileSelected = function onFileSelected(event) {
  // TODO: iterate over all selected files and trigger uploads
  var file = event.target.files[0];
  var self = this;

  return self.createVideo(file.name)
    .then(function(response) {
      return new VideoUpload(file, response, self);
    });
};


/*
function embedPlayer(accountId, videoId) {
  return new Promise(function (resolve) {
    var iframe = document.createElement('div');
    iframe.innerHTML = '<iframe src="//players.brightcove.net/' + accountId + '/default_default/index.html?videoId=' + videoId + '" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';
    iframe.innerHTML += '<code>&lt;iframe src="//players.brightcove.net/' + accountId + '/default_default/index.html?videoId=' + videoId + '" allowfullscreen webkitallowfullscreen mozallowfullscreen&gt;&lt;/iframe&gt;';
    iframe.innerHTML += '<a href="//players.brightcove.net/' + accountId + '/default_default/index.html?videoId=' + videoId + '">View in Player</a>';
    document.getElementsByTagName('body')[0].appendChild(iframe);
    resolve();
  });
}
*/

module.exports = BCUploader;
