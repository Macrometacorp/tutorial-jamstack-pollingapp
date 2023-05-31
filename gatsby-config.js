require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Macrometa Polling App`,
    description: `A polling app to showcase Macrometa's JAMStack capabilities`,
    author: `@gatsbyjs`,
  },
  pathPrefix: "/tutorial-jamstack-pollingapp",
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/poll/*`] },
    },
    {
      resolve: "gatsby-source-c8db",
      options: {
        config: "https://play2.paas.macrometa.io",
        auth: {
          email: process.env.MM_EMAIL,
          password: process.env.MM_PW
        },
        geoFabric: "polling_app",
        collection: 'markdownContent',
        map: {
          markdownContent: { title: "text/markdown", content: "text/markdown" }
        }
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        // CommonMark mode (default: true)
        commonmark: true,
        // Footnotes mode (default: true)
        footnotes: true,
        // Pedantic mode (default: true)
        pedantic: true,
        // GitHub Flavored Markdown mode (default: true)
        gfm: true,
        // Plugins configs
        plugins: [],
      },
    },
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: 'polling.gdn1',
        protocol: "http",
        hostname: "d1v71awf1hnoi8.cloudfront.net"
      },
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
