Implementing a Compatible Server API
------------------------------------

If you need to implement your own backend to evaporate-brightcove, there are 3 endpoints you must provide:

 * create video endpoint
 * sign upload endpoint
 * ingest upload endpoint

## High Level Overview

These three endpoints correspond to the three stages in the life cycle of a video ingestion:

Endpoint             | Stage     | Purpose             | Brightcove API Calls
---------------------|-----------|---------------------|------------------------
createVideoEndpoint  | Beginning | Initiate new upload | create video & read url
signUploadEndpoint   | Middle    | Authorize S3 uploads| none
IngestUploadEndpoint | End       | Transcode video     | ingest

## createVideoEndpoint

This endpoint must make two Brightcove API calls and store some transient data for use in a future endpoint.

First, it creates a new video entity in your Brightcove to house the uploaded content. We'll need the **video ID** that Brightcove returns to us.

Second, we use a special Brightcove API that provides an S3 bucket and temporary credentials with write access to the S3 bucket. Our server needs to store the **secret access key** returned by Brightcove, indexed by the video ID.

Finally, we put all the required data from both calls into a JSON object for the response.

### Example

Example request from `evaporate-brightcove`:

```
POST /upload HTTP/1.1
Content-Type: application/json
...

{"name":"Office_Perks.webm"}
```

Example response from server:

```
200 OK HTTP/1.1
Content-Type: application/json; charset=utf-8
...

{
  "accountId": "2345678901001",
  "videoId": "1234567898001",
  "bucket": "ingestion-upload-production",
  "awsAccessKeyId": "ASIAISEXAMPLE",
  "sessionToken": "FQoDYXdzEJ3//////////wEaDGP+s…S1Kdvved2GNIix+RjHAWKKzO+ssF",
  "objectKey": "2345678901001/1234567898001/d…20100d9301/Office_Perks.webm",
  "region": "us-east-1"
}
```

### Constructing the Response

These values must simply be stored on your server:

 * `accountId` -- its your Brightcove account ID
 * `region` -- always "us-east-1". This is where Brightcove's S3 bucket is located

These values come from calling the Brightcove CMS API [video create endpoint](https://brightcovelearning.github.io/Brightcove-API-References/cms-api/v1/doc/index.html#api-videoGroup-Create_Video). 

 * `videoId` -- Use the `id` field from the response for this value

These values from from calling the Brightcove Dynamic Ingest [Upload API](https://support.brightcove.com/source-file-upload-api-dynamic-ingest#S3urlRequest):

 * `bucket` -- use the `bucket` field. This is the S3 bucket the video will be uploaded
 * `objectKey` -- use the `object_key` field. This is the path in the above S3 bucket where the video will be uploaded
 * `awsAccessKeyId` -- use the `access_key_id` field. This is a temporary "user name" credential for AWS issued through the STS service.
 * `awsSecretAccessKey` -- use the `secret_access_key` field. This is a temporary "password" credential for AWS issued through STS service.
 * `sessionToken` -- use the `session_token` field. This temporary credential MUST be used for any STS issued credentials to work.

### Storing the Secret Access Key

If you run multiple servers behind a load balancer, it's recommended to store the AWS secret access key in a database until the upload has finished. This will ensure that no matter which server needs to know this information in the future, it will be available.

Alternatively, if you only operate one server, you could reduce latency simply storing the AWS secret access key in memory. Note that it's generally not considered a best practice to run only of a given server. This can become a single point of failure.

Another option, if the servers which implement the evaporate-brightcove endpoints have a "sticky" load balancer (in which requests from a given client always reach the same server), it may also be desirable to keep the secret access key in memory.

## signUploadEndpoint

S3 requires that upload requests are signed. A signed request involves computing a cryptographic hash in a very specific way, using a checksum of the upload content and the credentials (including the secret key and session token). The secret key and session token are omitted from the request headers. Thus, the signature is extremely difficult to guess without having the secret key and a valid signature proves the request is authorized. By incorporating a checksum of the content, it also allows S3 servers to verify the data integrity too.

Although the STS credentials are temporary and very limited, evaporate-brightcove takes the extra step of keeping the secret key on the server at all times and never exposing it to the browser. This technique follows the principle of "defense-in-depth" and ensures that credentials cannot be abused on the client side for unintended purposes.

The Evaporate.js library takes a single video upload and decides how many parts to make of it depending on the configuration. Evaporate.js then uses the cryptographic libraries provided by evaporate-brightcove to compute the checksum of that part, and produce an unsigned request (called a "canonical request" in the AWS documentation). evaporate-brightcove forwards the unsigned request to the `signUploadEndpoint` on our server.

Our server uses the video ID provided in the path, and it looks up the AWS secret key. Using the secret key, we compute an HMAC of the canonical request and return the signature.

Evaporate.js adds the signature to the canonical request, and does a PUT to S3 with the content.

This whole process is repeated for each part of the multipart upload until the video is fully uploaded.

### Example

Please look at the [`signHandler`](../examples/nodejs/src/controllers/sign.js) definition in the example nodejs reference implementation.

### Obtaining the Video ID

evaporate-brightcove will append a new segment to the path of the `signUploadEndpoint` url with the video ID. FOr example, if your `signUploadEndpoint` was `http://example.com/sign` and you had a video ID of 1000, evaporate-brightcove would send a GET request to `http://example.com/sign/1000`.

You must be able to retrive the AWS secret key stored during the `createVideoEndpoint` execution using the video ID.

### Obtaining the Canonical Request and Date

evaporate-brightcove will append the date as a query parameter `datetime`. Similarly, the canonical request will be a query parameter `to_sign`.

## ingestUploadEndpoint

Once the video is uploaded, Brightcove needs to be instructed to start transcoding the video. This endpoint must call the ingest endpoint for Brightcove Dynamic Ingest.

This endpoint just simply pass through the result to the evaporate-brightcove on the client side.

### Obtaining the Video ID

evaporate-brightcove will append a new segment to the path of the `ingestUploadEndpoint` url with the video ID. FOr example, if your `signUploadEndpoint` was `http://example.com/ingest` and you had a video ID of 1000, evaporate-brightcove would send a POST request to `http://example.com/ingest/1000`.
