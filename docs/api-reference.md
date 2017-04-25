API Reference
=============

Everything that follows is an object on the constructor.

### Required Parameters

#### `root` (string)

> CSS ID of the root element to display the uploader

Example:

```html
<div id="video-uploader"></div>
<script>
BCUploader({
  root: 'video-uploader',
  // ...
});
</script>
```

---

#### `createVideoEndpoint` (string)

> URL for creating new Brightcove video and returning multi-part upload data

 * See the [example server](./examples/nodes/src/controllers/upload.js) to get a good idea of what happens at this endpoint
 * Make sure this server is on the same domain name, otherwise you'll have to handle CORS

Example:

```html
<script>
BCUploader({
  createVideoEndpoint: '/upload',
  // ...
});
</script>
```

```js
// On server
router.get('/upload', function(req, res) {
  // Create Brightcove video and return AWS upload parameters
});
```

---

#### `signUploadEndpoint` (string)

> URL on server which signs S3 uploads using AWS secret key (without transmitting the secret key)

 * The actual path the server will receive requests on will have the videoId appended (ex: /sign/1234)
 * Make sure this server is on the same domain name, otherwise you'll have to handle CORS

Example:

```html
<script>
BCUploader({
  signUploadEndpoint: '/sign',
  // ...
});
</script>
```

```js
// On server
router.get('/sign/:videoId', function(req, res) {
  // Do AWS request signing here
});
```

---

#### `ingestUploadEndpoint` (string)

> URL to request once S3 upload is complete; starts Dynamic Ingest on object in S3


 * The actual path the server will receive requests on will have the videoId appended (ex: /ingest/1234)
 * Make sure this server is on the same domain name, otherwise you'll have to handle CORS

Example:

```html
<script>
BCUploader({
  ingestUploadEndpoint: '/ingest',
  // ...
});
</script>
```

```js
// On server
router.get('/ingest/:videoId', function(req, res) {
  // Call Brightcove Dynamic Ingest here
});
```

### Optional Parameters

####
