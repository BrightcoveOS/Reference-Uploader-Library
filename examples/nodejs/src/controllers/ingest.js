'use strict';

var url = require('url');

var brightcove = require('../brightcove');
var config = require('../config');
var db = require('../db');

module.exports = function ingest(req, res) {
  var { videoId } = req.params;
  var { bucket, objectKey } = req.body;
  var accountId = config.brightcove.accountId;

  var url = db.getApiRequestUrl(videoId);

  brightcove.post(`https://ingest.api.brightcove.com/v1/accounts/${accountId}/videos/${videoId}/ingest-requests`, {
    master: {url},
    profile: 'high-resolution',
  })
  .then((result) => res.json({result}))
  .catch((err) => res.status(500).json({err}));
};
