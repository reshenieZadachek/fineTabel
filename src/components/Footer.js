import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  text-align: center;
`

const Footer = ()=> {
  return (
    <FooterContainer>
      <p>&copy; 2024</p>
    </FooterContainer>
  );
}

export default Footer;