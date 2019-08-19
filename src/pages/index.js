import React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';

import Layout from '../components/layout';
import { Button } from '../styledComponents/theme';

const IndexPage = () => {
  const data = useStaticQuery(graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allC8Document {
      edges {
        node {
          title {
            childMarkdownRemark {
              html
            }
          }
          content {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
  }
  
`);
  const title = data.allC8Document.edges[0].node.title.childMarkdownRemark.html;
  const content = data.allC8Document.edges[0].node.content.childMarkdownRemark.html;

  return (
    <Layout data={data}>
      {() => (
        <>
          <div>
            <div dangerouslySetInnerHTML={{ __html: title }}></div>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
            <Link to="/new">
              <Button>New Poll</Button>
            </Link>
          </div>
        </>
      )}
    </Layout>
  )
};

export default IndexPage;
