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

#### `signUploadEndpoint` (string)

> URL for the multi-part upload endpoint on the server

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


