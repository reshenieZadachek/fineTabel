import React from 'react';
import styled from 'styled-components';
import ProgressBar from './ProgressBar'; // Импортируем прогресс-бар

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Title = styled.h1`
  margin: 10px 0;
  font-size: 24px;
`;

const Header = ({ progress }) => {
  return (
    <HeaderContainer>
      <Title>Таблица штрафов</Title>
      <ProgressBar progress={progress} small /> {/* Передаем progress и флаг small */}
    </HeaderContainer>
  );
};

export default Header;
