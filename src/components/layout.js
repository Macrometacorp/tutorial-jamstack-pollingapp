/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import Helmet from 'react-helmet';

import Header from './header';
import './layout.css';
import { Container } from '../styledComponents/layout';
import FabricContext from "../context/JSC8Context";
import { Heading2 } from '../styledComponents/typography';

const TemplateWrapper = ({ children }) => {
  const data = useStaticQuery(graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allSitePlugin(filter: {name: {eq: "gatsby-source-c8db"}}) {
      edges {
        node {
          name
          pluginOptions {
            auth {
              password
              tenant
              user
            }
            config
            geoFabric
          }
        }
      }
    }
  }  
`);

  const { pluginOptions: { auth: { tenant, user, password }, config, geoFabric } } = data.allSitePlugin.edges[0].node;

  return (
    <FabricContext.Consumer>
      {
        fabricCtx => {
          let component = <Container>{children(fabricCtx)}</Container>;
          if (!fabricCtx.isSignedIn) {
            component = <Heading2>Loading...</Heading2>;
            fabricCtx.updateFabric(config, tenant, user, password, geoFabric);
          }
          return (
            <div>
              <Helmet
                title={data.site.siteMetadata.title}
                meta={[
                  { name: 'description', content: 'Sample' },
                  { name: 'keywords', content: 'sample, something' },
                ]}
              />
              <Header
                background="background-image: linear-gradient(116deg, #08AEEA 0%, #2AF598 100%)"
                title={data.site.siteMetadata.title}
              />
              {component}
            </div>
          )
        }
      }
    </FabricContext.Consumer>
  )
};

TemplateWrapper.propTypes = {
  children: PropTypes.func,
  data: PropTypes.object,
};

export const query = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default TemplateWrapper;