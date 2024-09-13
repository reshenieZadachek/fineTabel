import React from 'react';
import styled from 'styled-components';

const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: #e0e0e0;
  height: ${({ small }) => (small ? '5px' : '20px')}; /* Меньшая высота для маленького бара */
  border-radius: 10px;
  margin-top: ${({ small }) => (small ? '0' : '10px')};
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: #2751B7;
  transition: width 0.3s;
  border-radius: inherit;
`;

const ProgressBar = ({ progress, small }) => {
  return (
    <ProgressBarContainer small={small}>
      <ProgressBarFill progress={progress} />
    </ProgressBarContainer>
  );
};

export default ProgressBar;
