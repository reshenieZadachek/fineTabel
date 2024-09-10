import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  
`

const Header = ()=> {
  return (
    <HeaderContainer>
      <h1>Таблица штрафов</h1>
      {/* Добавьте здесь меню навигации или другое содержимое */}
    </HeaderContainer>
  );
}

export default Header;