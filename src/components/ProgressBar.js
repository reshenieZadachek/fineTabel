import React from 'react';
import styled from 'styled-components';

const ProgressBarContainer = styled.div`
    position: absolute;
    bottom: 5px;
    display: flex;
    left: 0;
    width: 100%;
    background-color: #e0e0e0;
    height: 3px;
    border-radius: 10px;
    margin-top: 0;
    align-self: flex-start;
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
