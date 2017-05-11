'use strict';

var crypto = require('crypto');

var config = require('../config');
var db = require('../db');

module.exports = function signHandler(req, res) {
  var {videoId} = req.params;
  var {to_sign, datetime} = req.query;
  var awsSecretAccessKey = db.getSecretAccessKey(videoId);

  console.log(`Signing string '${to_sign}' with aws v4 signature algorithm`);
  console.log('Signing parameters:', {videoId, datetime, region: config.aws.region});

  res.send(v4(
    to_sign,
    datetime.slice(0,8),
    awsSecretAccessKey,
    config.aws.region,
    's3'
  ));
}

function v4(toSign, timestamp, awsSecretKey, awsRegion, awsService) {
  const date = hmac('AWS4' + awsSecretKey, timestamp);
  const region = hmac(date, awsRegion);
  const service = hmac(region, awsService);
  const signing = hmac(service, 'aws4_request');
  return hexhmac(signing, toSign);
}

function hmac(key, value) {
  return crypto.createHmac('sha256', key).update(value).digest();
}

function hexhmac(key, value) {
  return crypto.createHmac('sha256', key).update(value).digest('hex');
}
