import React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';

import Layout, {query} from '../components/layout';
import {Heading2} from '../styledComponents/typography';
import { Button } from '../styledComponents/theme';
import Image from '../components/image';
import SEO from '../components/seo';

const IndexPage = () => {
  const data = useStaticQuery(graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`);

  return (
    <Layout data={data}>
      {() => (

      <>
      <div>
        <Heading2>A next-generation polling application</Heading2>
        <p>
          Built from the ground up - Ut pariatur velit eu fugiat ut. Veniam commodo
          non esse proident ut anim irure voluptate commodo aliqua tempor Lorem
          excepteur cupidatat. Nulla commodo ex laboris eu sit nisi exercitation
          dolore labore qui elit non Lorem minim. Voluptate pariatur anim esse irure
          ipsum ut pariatur. Mollit occaecat velit occaecat sint pariatur tempor.
          Consectetur culpa tempor dolore amet officia dolore nulla nisi sunt ea.
        </p>
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
