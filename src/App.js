import React, { useState } from 'react';
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
  const [progress, setProgress] = useState(0);
  return (
    <AppContainer>
        <Header progress={progress} />
        <Main setProgress={setProgress} />
        <Footer />
    </AppContainer>
  );
}

export default App;