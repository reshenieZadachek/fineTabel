import React from 'react';
import styled from 'styled-components';
import { httpGetSpam } from '../http/VesikTap';

const StyledButton = styled.button`
  width: 100px;
  height: 50px;
  border-radius: 10px;
  background-color: #2751B7; /* Точный синий цвет фона */
  font-size: 13pt;
  color: white;
  border: none;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s;
  &:hover{
    background-color: #3E7DBA;
  }
`;

const TapBut = ({selectedDate, setPhones, secretKey, setChechKey}) => {
  
  const clickTapFunc = async () => {
    try {
      setPhones([])
      let allMas = []
      const firtsResponse = await httpGetSpam(selectedDate, 0, 0, secretKey);
      setChechKey('Ваш ключ введен верно ожидайте формирования таблицы')
      firtsResponse['requests'].forEach(el => {
        if(el['project']['id'] === 1){
          allMas.push(el['communications']['0']['phones'])
        } 
      });
      
      for(let i = 1; i < Math.ceil(((firtsResponse['statuses']['4']['count']) - 20) / 20)+1; i++) {
        const response = await httpGetSpam(selectedDate, 1, i*20, secretKey);
        response['requests'].forEach(el => {
          if(el['project']['id'] === 1){
            allMas.push(el['communications']['0']['phones'])
          }           
        });
      }
      
      let cleanedPhoneNumbers = [...new Set(
        allMas.map(number => 
          (typeof number[0] === 'string' && number.length > 0) ? number[0].replace(/\+/g, '') : ''
        )
      )].filter(Boolean);
      
      setPhones(cleanedPhoneNumbers)
    } catch (error) {
      setChechKey('Вы ввели неверный ключ')
      console.error('Ошибка при отправке запроса (тап):', error);
    }
  };

  return(
    <StyledButton onClick={clickTapFunc}>Создать</StyledButton>
  )
};

export default TapBut;