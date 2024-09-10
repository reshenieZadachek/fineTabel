import React from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const App = () => {
  return (
    <AppContainer>
        <Header />
        <Main />
        <Footer />
    </AppContainer>
  );
}

export default App;