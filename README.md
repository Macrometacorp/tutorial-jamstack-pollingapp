# Intro

Welcome to our example app showing off how to make a JAM stack application using Macrometa and GatsbyJS.

This demo makes use of [c8db-source-plugin](https://www.npmjs.com/package/gatsby-source-c8db) to get some of the data as markdown and then transform it to HTML to display directly in the browser.

# Getting Started 
  1. [nodejs and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and Gatsby-CLI `npm install -g gatsby-cli` must be installed on your machine.
  2. If you don't have one already go ahead and signup for a [free Macrometa developer account](https://auth.paas.macrometa.io/signup).
  3. Once you're logged in to Macrometa create a `document collection` called `markdownContent`. Then create a single document with `title` and `content` fields in markdown format. This creates your data model the app will be using for it's static content.

      Here's an example of what the `markdownContent` collection should look like:

  ```json
{
  "title": "## Real-Time Polling Application",
  "content": "Full-Stack Geo-Distributed Serverless App Built with GatsbyJS and Macrometa!"
}
  ```
 `content` and `title` keys in the document are in the markdown format. Once they go through `gatsby-source-c8db`, data in `title` is converted to `<h2></h2>`, and `content` to `<p></p>`.

  4. Now create a second `document collection` called `polls`. This is where the poll data will be stored.

 In the `polls` collection each poll will be stored as a separate document. A sample document is mentioned below:

 ```json
{
  "pollName": "What is your spirit animal?",
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
    },
    {
      "editing": false,
      "id": "b8aa42",
      "text": "unicorn",
      "votes": 10
    }
  ]
}
 ```

# Setting up Auth
 Your Macrometa login details along with the collection to be used and markdown transformations has to be provided in the application's `gatsby-config.js` like below:
 
 ```js
    {
      resolve: "gatsby-source-c8db",
      options: {
        config: "https://play.macrometa.io",
        auth: {
          email: process.env.MM_EMAIL,
          password: process.env.MM_PW
        },
        geoFabric: "_system",
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

Under `password` you will notice that it says `process.env.MM_PW`, instead of putting your password there we are going to create some `.env` files and make sure that they are listed in our `.gitignore` file so we don't accidently push our Macrometa password back to Github. In your root directory create `.env.development` and `.env.production` files.

You will only have one thing in each of those files: `MM_PW='<your-password-here>'`

# Running the app locally

1. Fork this reopo and clone your fork onto your local machine
2. Run `npm install`
3. Execute `npm run develop` to start the local server. This will start local development server on `http://localhost:<some_port>` and the GraphiQL should be at `http://localhost:<some_port>/___graphql`

# How to deploy app(UI) on Github Pages

Simply run `npm run deploy`!

Gatsby will automaticall generate the static code for the site, create a branch called `gh-pages`, and deploy it to Github.

Now you can access your site at `<your-github-username>.github.io/tutorial-jamstack-pollingapp`

# You can checkout an example of the app here

To allow multiple people to vote on the same topic just share the vote URL with them. A sample URL can be 
https://macrometacorp.github.io/tutorial-jamstack-pollingapp/poll/dab09a.

To create a new poll use https://macrometacorp.github.io/tutorial-jamstack-pollingapp
