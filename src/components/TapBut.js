import React from 'react';
import styled from 'styled-components';
import { httpGetSpam } from '../http/VesikTap';

const StyledButton = styled.button`
  width: 100px;
  height: 50px;
  border-radius: 10px;
  background-color: #2751B7;
  font-size: 13pt;
  color: white;
  border: none;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s;
  &:hover {
    background-color: #3E7DBA;
  }
`;

const TapBut = ({ selectedDate, setPhones, secretKey, setChechKey, isDay, setProgress }) => {
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchDataForDate = async (date) => {
    let allMas = [];
    const firtsResponse = await httpGetSpam(date, 0, 0, secretKey);
    firtsResponse['requests'].forEach(el => {
      if (el['project']['id'] === 1) {
        allMas.push(el['communications']['0']['phones']);
      }
    });
    
    for (let i = 1; i < Math.ceil(((firtsResponse['statuses']['4']['count']) - 20) / 20) + 1; i++) {
      const response = await httpGetSpam(date, 1, i * 20, secretKey);
      response['requests'].forEach(el => {
        if (el['project']['id'] === 1) {
          allMas.push(el['communications']['0']['phones']);
        }           
      });
    }

    return [...new Set(
      allMas.map(number => 
        (typeof number[0] === 'string' && number.length > 0) ? number[0].replace(/\+/g, '') : ''
      )
    )].filter(Boolean);
  };

  const clickTapFunc = async () => {
    try {
      setPhones([]);
      setChechKey('Ваш ключ введен верно, ожидайте формирования таблицы');
      setProgress(0); // Сбрасываем прогресс

      if (isDay) {
        const cleanedPhoneNumbers = await fetchDataForDate(selectedDate);
        setPhones([{ date: selectedDate, phones: cleanedPhoneNumbers }]);
        setProgress(100); // Устанавливаем прогресс 100% для одного дня
      } else {
        const [year, month] = selectedDate.split('-').map(Number);
        const daysInMonth = getDaysInMonth(year, month - 1);
        let monthData = [];
        
        for (let day = 1; day <= daysInMonth; day++) {
          const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayData = await fetchDataForDate(date);
          monthData.push({ date, phones: dayData });
          
          // Обновляем прогресс в зависимости от текущего дня
          setProgress(Math.round((day / daysInMonth) * 100));
          
          if (day < daysInMonth) {
            await delay(500); // Задержка между запросами
          }
        }
        setPhones(monthData);
      }
    } catch (error) {
      setChechKey('Вы ввели неверный ключ');
      console.error('Ошибка при отправке запроса (тап):', error);
    }
  };

  return (
    <>
      <StyledButton onClick={clickTapFunc}>Создать</StyledButton>
    </>
  );
};

export default TapBut;
