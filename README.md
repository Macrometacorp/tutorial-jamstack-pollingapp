# 1. Overview

Demo to show how to make a JAM stack application using C8DB and gatsby.

This demo makes use of [c8db-source-plugin](https://www.npmjs.com/package/gatsby-source-c8db) to get some of the data as markdown and then transform it to HTML to display directly in the browser.

The application is deployed at http://try.macrometa.gatsby.s3-website-us-east-1.amazonaws.com

# 2. Prerequisites
  1. `nodejs` and `npm` must be installed on your system.
  2. There should be a collection called `markdownContent` in your federation, with a single document with `title` and `content` fields in markdown format.

      A sample document in `markdownContent` can be seen below:

  ```json
{
  "title": "## A Next-Generation Polling Application",
  "content": "Built from the ground up - Ut pariatur velit eu fugiat ut. Veniam commodo non esse proident ut anim irure voluptate commodo aliqua tempor Lorem excepteur cupidatat. Nulla commodo ex laboris eu sit nisi exercitation dolore labore qui elit non Lorem minim. Voluptate pariatur anim esse irure ipsum ut pariatur. Mollit occaecat velit occaecat sint pariatur tempor. Consectetur culpa tempor dolore amet officia dolore nulla nisi sunt ea."
}
  ```
 `content` and `title` keys in the document are in the markdown format. Once they go through `gatsby-source-c8db`, data in `title` is converted to `<h2></h2>`, and `content` to `<p></p>`.

  3. There should be a collection called `polls` where the poll data will be stored.

 In the `polls` collection each poll will be stored as a separate document. A sample document is mentioned below:

 ```json

{
  "pollName": "Which pet do you prefer?",
  "polls": [
    {
      "editing": false,
      "id": "975e41",
      "text": "dog",
      "votes": 2
    },
    {
      "editing": false,
      "id": "b8aa60",
      "text": "cat",
      "votes": 1
    }
  ]
}
 ```

## Deployment Prerequisites

  4. Create a S3 bucket with Public Access(for more steps look at Deploy on CloudFront Section).
  Enable `Static Website Hosting` from the `Properties` tab of the S3 bucket, mention index.html as the index document.
 
  5. Create a CloudFront Distribution with `Origin Domain Name` pointing to the S3 Bucket where you will upload all the build files, set `Default Root Object` to index.html. Once the Distribution is created, navigate to the `invalidations` tab of the Distribution and create an invalidation with `*` in the `Object Paths`. Then, go to the `Error Page` tab and `Create Custom Error Response` for 403 and 404 response codes, mention `/index.html` in `Response Page Path` column and 200 in `HTTP Response Code`, set `Error Catching Minimum TTL` and save the settings.

# 3. Providing connection to the federation for the plugin.
 The federation login details along with the collection to be used and transformations has to be provided in the application's `gatsby-config.js` like below:
 
 ```js
    {
      resolve: "gatsby-source-c8db",
      options: {
        config: "https://try.macrometa.io",
        auth: {
          tenant: "<my-tenant>",
          user: "<my-user>",
          password: "<my-password>"
        },
        geoFabric: "<my-geoFabric>",
        collection: 'markdownContent',
        map: {
          markdownContent: { 
            title: "text/markdown",
            content: "text/markdown" 
          }
        }
      }
    }

 ```

# 4. Sharing the URL for multiple people to vote
To allow multiple people to vote on the same topic just share the vote URL with them. A sample URL can be http://try.macrometa.gatsby.s3-website-us-east-1.amazonaws.com/poll/c466b0

# 5. Running the app locally

>NOTE: This step is just for running the UI locally. The actual app is deployed on an AWS S3 Bucket. For the steps on S3 goto the How to deploy app on S3 section.

1. Clone this reopo
2. Run `npm install` to get all the `node modules`
3. Execute `npm run develop` to start the local server. This will start  local development server on `http://localhost:<some_port>` and the GraphiQL should be at `http://localhost:<some_port>/___graphql`

# 6. How to deploy app(UI) on CloudFront

If `node_modules` is not there, execute `npm install`.
If you dont have S3 CLI configured then configure it. More info can be found [here](https://www.gatsbyjs.org/docs/deploying-to-s3-cloudfront/#getting-started---aws-cli).

This project makes use of `gatsby-plugin-s3` to publish to S3.
Make sure you have a bucket on S3 with appropriate bucket policy.

A sample `bucket policy` is:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<your-s3-bucket-name>/*"
        }
    ]
}
```
Once the bucket and distribution are made just provide your `bucketName` and `hostname` in the `gatsby-config.js` file of the project
```
{
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: 'try.macrometa.gatsby',
        protocol: "http",
        hostname: "d2m18vv70x0jgo.cloudfront.net"
      },
    }
```
