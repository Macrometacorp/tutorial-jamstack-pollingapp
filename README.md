# 1. Overview

Demo to show how to make a JAM stack application using C8DB and gatsby.

This demo makes use of [c8db-source-plugin](https://www.npmjs.com/package/gatsby-source-c8db) to get some of the data as markdown and then transform it to HTML to display directly in the browser.

The application is deployed at http://try.macrometa.gatsby.s3-website-us-east-1.amazonaws.com

# 2. Prerequisites
  1. `nodejs` and `npm` must be installed on your system.
  2. There should be a collection called `poll` in your federation, with a single document with `title` and `content` fields in markdown format.

    > NOTE: All the info for this demo is extraced from gatsby at runtime. Therefore document's `_key` should be the same as what it was while gatsby build was taking place. For now it is `955694336`.


  A sample document can be seen below:

  ```json
{
  "title": "## A Next-Generation Polling Application",
  "content": "Built from the ground up - Ut pariatur velit eu fugiat ut. Veniam commodo non esse proident ut anim irure voluptate commodo aliqua tempor Lorem excepteur cupidatat. Nulla commodo ex laboris eu sit nisi exercitation dolore labore qui elit non Lorem minim. Voluptate pariatur anim esse irure ipsum ut pariatur. Mollit occaecat velit occaecat sint pariatur tempor. Consectetur culpa tempor dolore amet officia dolore nulla nisi sunt ea.",
  "polls":{}
}

  ```
  The `polls` key will contain the polled data. `content` and `title` keys in the document are in the markdown format. Once they go through `gatsby-source-c8db`, data in `title` is converted to `<h2></h2>`, and `content` to `<p></p>`.

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
        collection: 'poll',
        map: {
          poll: { title: "text/markdown", content: "text/markdown" }
        }
      }
    }

 ```

# 4. Running the app locally

>NOTE: This step is just for running the UI locally. The actual app is deployed on an AWS S3 Bucket. For the steps on S3 goto the How to deploy app on S3 section.

1. Clone this reopo
2. Run `npm install` to get all the `node modules`
3. Execute `npm run develop` to start the local server. This will start  local development server on `http://localhost:<some_port>` and the GraphiQL should be at `http://localhost:<some_port>/___graphql`

# 5. How to deploy app(UI) on S3

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
Once the bucket is made just provide your `bucketName` in the `gatsby-config.js` file of the project
```
{
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: 'try.macrometa.gatsby'
      }
```