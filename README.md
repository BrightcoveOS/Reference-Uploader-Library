Evaporate Brightcove [![Build Status](https://travis-ci.org/brycefisher/bcuploader.svg?branch=master)](https://travis-ci.org/brycefisher/bcuploader)
====================

> Frontend module for direct multipart upload to s3 with secret sauce for Brightcove ingest

## What Is This?

Evaporate Brightcove is an npm module providing JavaScript for use in the browser to upload videos to your [Brightcove Video Cloud](https://www.brightcove.com/en/online-video-platform). In order to use this module, you'll also need to setup a server to which can secure manage your Brightcove and AWS credentials -- we've included a working reference implementation for Node.js to help you get started.

![](/upload-all-states.png)

**High Level Features:**

 * Direct upload to AWS S3 -- no load on your servers!
 * Multi-part upload to maximize available client bandwidth
 * Highly configurable:
    * localize all the text using your own strings
    * capture error reports
    * measure transfer speed
    * custom validation prior to upload
 * Wraps battle tested library [Evaporate.js](https://www.npmjs.com/package/evaporate) -- allows you pass any options you want!

## Try the Node.js Example

See this [app running](https://evaporate-brightcove.herokuapp.com/) in Heroku right now!

Clone this repo and play with the the [Node.js example source code](./examples/nodejs/README.md) for a fully functional simple example.

## Quick Start Guide

See the [quick start guide](./docs/quick-start.md).

## API Reference

See the [API docs](./docs/api-reference.md).

## Implementing Server API

See the [implementation docs](./docs/implementing-server-api.md)
