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

#### previewText (string)

> Text to display in preview link, after transcoding is done

 * Default: "Preview"

---

#### onPreview (function)

> Callback which is invoked when Preview link is clicked

If a `playerId` is provided to BCUploader, the default implementation will
creating a player over the Drag n' Drop landing area and try to playback the video.

NOTE: At this time, there is no way for BCUploader to know if a transcode is actually
complete, so it's entirely possible this will be a suboptimal experience for the user.

Use `transcodeDelayMS` to tune the default wait time before showing the preview link.

 * See the default implementation at [src/components/default-preview.js](../src/components/default-preview.js)
 * See the lower level updatePreview() implementation at [src/components/preview.js](../src/components/preview.js)
 * Callback is called with "context" object having these properties:
   * `defaultPreviewAction` (function) - see link above. Useful for using the default but adding tracking code or firing other events on the rest of the page.
   * `updatePreview` (function) - allows you use the builtin preview function but provide different videoId, accountId, or playerId
   * `rootElement` (DOM node) - useful for direct manipulation of DOM if you want to forego the builtin preview functionality
   * `videoId` (number) - Brightcove Video ID. Useful for constructing a player, among other things
   * `accountId` (number) - Brightcove account ID. Useful for constructing a player, among other things
   * `playerId` (string) - the `playerId` possibly provided to BCUploader constructor
   * `fileName` (string) - file name from the original file upload
   * `fileSize` (number) - the number of bytes for the upload

Example:

```js
<script>
BCUploader({
  playerId: 1234567890,
  onPreview: function(context) {
    console.log(context.playerId);         // Hy9fawLj43
    console.log(context.videoId);          // 2345678001
    console.log(context.accountId);        // 3456789100112
    console.log(context.fileName);         // "cats.mp4"
    console.log(context.fileSize);         // 90654201
    console.log(context.rootElement);      // <DOM node for the root of the BCUploader instance>
    context.updatePreview({videoId:23456, playerId: 'default', accountId: '12345'}); // Renders default preview in default preview DOM element
    context.defaultPreviewAction(context); // Performs the default preview
  },
  // ...
});
</script>
```

---

#### playerId (number)

> Brightcove player ID for use in previewing a video after transcode

This player ID will be passed to the onPreview callback as part of the context. If not provided,
the default player for the account is used.

 * Default: 'default'

---

#### landingText (string)

> Text shown in the Drag n Drop area

 * Default: "Drag Files here to Upload"

---

#### transcodingDelayMS (number)

> Milliseconds to wait for transcoding to finish

For simplicity, we don't actually check to see if the transcoding is complete; instead we just update
the UI optimistically after a certain amount of time.

 * Default: 5000

---

#### transcodingText (string)

> Status text shown next to video after Dynamic Ingest begins

 * Default: "Transcoding"

---

#### onProgress (function)

> Regularly fired callback which provides progress information

 * Default: `function(){}`
 * Callback is called with these arguments:
   1. `percent` (number) - between 0 and 1
   2. `statistics` (object)
     * speed (float) - average speed, bytes/second
     * readableSpeed (string) - human readable speed
     * loaded (int) - bytes loaded since last progress event

Example:

```js
<script>
BCUploader({
  onProgress: function(percent, stats) {
    console.log(percent);             // 0.239
    console.log(stats.speed);         // 70343222.003493043
    console.log(stats.readableSpeed); // "703 Kb",
    console.log(stats.loaded);        // 7034333
  },
  // ...
});
</script>
```

---

#### onStarted (function)

> Callback fired when the file upload is started in the browser

NOTE: The S3 upload has not necessarily started at this point.

 * Default: `function(){}`
 * Callback receives the name of the file as a string

---

#### onComplete (function)

> Callback fired when a file is finished uploading to S3

---

#### onUploadInitiated (function)

> Callback fired when S3 assigns an upload ID

---

#### onFileSelected (function)

> Callback when the user selects a file

This call MUST return a promise. If the promise rejects, the upload is aborted. You can use this asynchronously validate a file prior to upload.

Example:

```js
<script>
BCUploader({
  onFileSelected: function(file) {
    return new Promise(function(resolve, reject) {
      if (!file.name.endsWith("mp4")) {
        reject("Only mp4s can be uploaded");
      } else {
        resolve(file);
      }
    });
  },
  // ...
});
</script>
```

---

#### onError (function)

> Callback fires any time an error occurs during upload to S3

---

#### evaporate (object)

> Config passed directly to evaporate, bypassing Evaporate Brightcove

See the full list of options on [the npm module page](https://www.npmjs.com/package/evaporate).

Example:

```js
<script>
BCUploader({
  evaporate: {
    logging: false
  },
  // ...
});
</script>
```
