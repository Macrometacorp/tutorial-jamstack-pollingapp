import { Link } from 'gatsby';
import styled from 'styled-components';
import { Container } from '../styledComponents/layout';
import PropTypes from 'prop-types';
import React from 'react';

const HeaderContainer = styled.header`
  ${props => props.background};
  margin-bottom: 1.45rem;
`;

const HeaderWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 1.45rem 1.0875rem;
`;

const Heading1 = styled.h1`
  margin: 0;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
`;

const BACKGROUND = 'background-color: #20232a';

const Header = ({ background, title }) => (
  <HeaderContainer background={background}>
    <Container>
      <Heading1>
        <StyledLink to="/">{title}</StyledLink>
      </Heading1>
    </Container>
  </HeaderContainer>
);

Header.propTypes = {
  background: PropTypes.string,
  title: PropTypes.string,
};

Header.defaultProps = {
  background: BACKGROUND,
  title: `Polling App`,
};

export default Header;
