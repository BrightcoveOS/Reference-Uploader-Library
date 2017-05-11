Quick Start for Evaporate Brightcove
====================================

At this end of this guide you'll have a working Node.js Express server that leverages Evaporate Brightcove.

## Sign Up for a Brightcove Account

If you plan to partner with Brightcove and build integrations with Video Cloud or other Brightcove products, [sign up for the partner program](http://go.brightcove.com/partner-inquiry). If you meet the criteria for becoming a partner, our team will set you up with an account

If you're a Brightcove customer, you should already have access to Video Cloud.

### Brightcove OAuth ID and Secret

We'll need Brightcove API credentials. The Brightcove API wraps the AWS STS service, such that you no longer need to manage nor configure an S3 bucket to use this service. Temporary credentials are issued for each upload which this module handles transparently.

Inside Video Cloud:

 1. Click the ADMIN link in the Studio header.
 2. Click the API Authentication link. The API Authentication page will open displaying your current client registrations.
 3. Click Register New Application.
 4. Enter a Name and Short Description for the client registration.
 5. Select one or more of your accounts for authorization.
 6. Check the following permissions:
   * CMS:
    * Video Read
    * Video Read/Write
  * Dynamic Ingest:
    * Create
    * Push Files
  * Players:
    * Read
 7. Click save
 8. Store the Client ID and Secret for later steps

## Get the example code working

You must already have Node.js installed on your platform and have npm (or yarn) setup. The following steps will download this source code from github and work on the example code.

```sh
git clone https://github.com/BrightcoveOS/evaporate-brightcove.git
cp evaporate-brightcove/examples/nodejs my-app
cd my-app
npm install
cp .env-sample .env
```

Open .env in your text editor and replace all the values there with the credentials from above.

## Start the example code

```
npm start
```

This command watches the source code for the npm module and rebuilds as it changes; it also starts the Node.js example app, watching that directory for changes too. You can edit nearly any file in this repo and see the changes right away.

## Upload Your First Video

Then navigate to [localhost:5000](http://localhost:5000/) to see the code in action. If you're looking for a video to upload, try [coverr.co](http://coverr.co). You should see a new video appear in Video Cloud right away. Shortly, you'll see the thumbnail and be able to playback the video.

## Fin

At this point you should have a fully functional working sample app.
