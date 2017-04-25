Quick Start for Evaporate Brightcove
====================================

At this end of this guide you'll have a working Node.js Express server that leverages Evaporate Brightcove.

## 0. Obtain Credentials

We'll need Brightcove API credentials and AWS credentials.

### 0.0 Brightcove OAuth ID and Secret

If you plan to partner with Brightcove and build integrations with Video Cloud or other Brightcove products, [sign up for the partner program](http://go.brightcove.com/partner-inquiry). If you meet the criteria for becoming a partner, our team will set you up with an account

If you're a Brightcove customer, you should already have access to Video Cloud.

Either way, login to Video Cloud, and:

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

### 0.1 AWS Credentials

If you don't already have an AWS account, [signup for an account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) self-service now. Once you have an account, login and:

 1. Go to [IAM](https://console.aws.amazon.com/iam/home)
 2. Click on Users in the left navigation
 3. Click the "Add User" button at the top of the page
 4. Choose a username (probably the same name you used for Brightcove Client registration above)
 5. Check the box for "Programmatic Access"
 6. Click Next
 7. Click Next again (don't pick any permissions here -- we'll add some later)
 8. Click create user
 9. Copy the Access Key ID and Secret Access Key for later.
10. Click close
11. Choose the user you created from the list of users
12. Copy the "User ARN" value for later

## Creating an S3 Bucket

In your AWS account:

 1. Go to the [S3 console](https://console.aws.amazon.com/s3/home?region=us-east-1#)
 2. Click "Create bucket"
 3. Enter a name
 4. Choose a region close to you (remember this for a later step!)
 5. Click Next
 6. Don't set any properties -- click next
 7. Don't set any user permissions nor public access -- click next
 8. Click create bucket

### Configure the Bucket for direct upload from Browsers (CORS)

 1. Go to the [S3 console](https://console.aws.amazon.com/s3/home?region=us-east-1#)
 9. Click your bucket on the list of buckets
 10. In the popup, click on Permissions
 11. Click on CORS configuration
 12. Paste in the following:
    ```
    <?xml version="1.0" encoding="UTF-8"?>
    <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
      <CORSRule>
          <AllowedOrigin>*</AllowedOrigin>
          <AllowedMethod>PUT</AllowedMethod>
          <AllowedMethod>POST</AllowedMethod>
          <AllowedMethod>DELETE</AllowedMethod>
          <AllowedMethod>GET</AllowedMethod>
          <ExposeHeader>ETag</ExposeHeader>
          <AllowedHeader>*</AllowedHeader>
      </CORSRule>
    </CORSConfiguration>
    ```
 13. Click "Save"

### Grant S3 permissions to your AWS User


 1. Go to the [S3 console](https://console.aws.amazon.com/s3/home?region=us-east-1#)
 9. Click your bucket on the list of buckets
 10. In the popup, click on Permissions
 11. Click on Bucket Policy
 12. Paste in the following:
    ```
    {
        "Version": "2012-10-17",
        "Id": "EvaporateBrightcovePolicy",
        "Statement": [
            {
                "Sid": "",
                "Effect": "Allow",
                "Principal": {
                    "AWS": "<AWS User ARN>",
                },
                "Action": [
                    "s3:AbortMultipartUpload",
                    "s3:ListMultipartUploadParts",
                    "s3:PutObject"
                ],
                "Resource": "arn:aws:s3::<S3 BUCKET NAME>/*"
            }
        ]
    }
    ```
 13. Replace <AWS User ARN> with the ARN from above
 14. Replace <S3 Bucket with the BUCKET NAME> from above
 15. Save

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

```
npm start
```

Then navigate to [localhost:5000](http://localhost:5000/) to see the code in action. At this point you should have a fully functional working sample app.
