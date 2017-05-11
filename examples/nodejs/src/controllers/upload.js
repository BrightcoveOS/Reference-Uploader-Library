'use strict';

var brightcove = require('../brightcove');
var config = require('../config');
var db = require('../db');

module.exports = function uploadHandler(req, res) {
  var videoName = req.body.name;
  var accountId = config.brightcove.accountId;
  var encodedSourceName = encodeURIComponent(videoName);
  var video;

  console.log('Starting new upload:', JSON.stringify(req.body));

  brightcove.post(`https://cms.api.brightcove.com/v1/accounts/${accountId}/videos`, {
    name: videoName,
  })
  .then(function(videoData) {
    console.log('Create video succeeded!');
    video = videoData;

    return brightcove.get(`https://ingest.api.brightcove.com/v1/accounts/${accountId}/videos/${video.id}/upload-urls/${encodedSourceName}`, {})
  })
  .then(function(response) {
    db.save(video.id, response);

    res.status(200).json({
      accountId: config.brightcove.accountId,
      videoId: video.id,
      bucket: response.bucket,
      awsAccessKeyId: response.access_key_id,
      sessionToken: response.session_token,
      objectKey: response.object_key,
      region: config.aws.region,
    });
  })
  .catch((err) => {
    console.error(err);
    return res.status(500).send(err.message);
  });
}
