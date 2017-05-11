'use strict';

require('dotenv').config();

Error.stackTraceLimit = 50;

var config = {
  port: process.env.PORT || 3000,

  brightcove: {
    accountId: process.env.BRIGHTCOVE_ACCOUNT_ID,
    client: {
      id: process.env.BRIGHTCOVE_CLIENT_ID,
      secret: process.env.BRIGHTCOVE_CLIENT_SECRET
    }
  },

  aws: {
    region: 'us-east-1',
  }
};

module.exports = config;
