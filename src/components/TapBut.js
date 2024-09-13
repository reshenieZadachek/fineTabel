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

const TapBut = ({ selectedDate, setPhones, secretKey, setChechKey, isDay, setProgress, currentDate }) => {
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchDataForDate = async (date, updateProgress) => {
    let allMas = [];
    const firtsResponse = await httpGetSpam(date, 0, 0, secretKey);
    firtsResponse['requests'].forEach(el => {
      if (el['project'] && el['project']['id'] === 1 && el['communications'] && el['communications']['0'] && el['communications']['0']['phones']) {
        allMas.push(el['communications']['0']['phones']);
      }
    });

    const totalPages = Math.ceil(((firtsResponse['statuses']['4']['count']) - 20) / 20) + 1;
    
    for (let i = 1; i < totalPages; i++) {
      const response = await httpGetSpam(date, 1, i * 20, secretKey);
      response['requests'].forEach(el => {
        if (el['project'] && el['project']['id'] === 1 && el['communications'] && el['communications']['0'] && el['communications']['0']['phones']) {
          allMas.push(el['communications']['0']['phones']);
        }
      });

      // Обновляем прогресс после каждого запроса страницы
      const progressIncrement = (1 / totalPages) * updateProgress;
      setProgress(prev => Math.min(100, prev + progressIncrement));
      await delay(300); // Имитация задержки для более плавного обновления
    }

    return [...new Set(
      allMas.flatMap(numbers => 
        Array.isArray(numbers) ? numbers.map(number => 
          (typeof number === 'string' && number.length > 0) ? number.replace(/\+/g, '') : ''
        ) : []
      )
    )].filter(Boolean);
  };

  const clickTapFunc = async () => {
    try {
      setPhones([]);
      setChechKey('Ваш ключ введен верно, ожидайте формирования таблицы');
      setProgress(0);

      if (isDay) {
        const selectedDateObj = new Date(selectedDate);
        if (selectedDateObj <= currentDate) {
          const cleanedPhoneNumbers = await fetchDataForDate(selectedDate, 100);
          setPhones([{ date: selectedDate, phones: cleanedPhoneNumbers }]);
        } else {
          setPhones([{ date: selectedDate, phones: [] }]);
        }
        setProgress(100);
      } else {
        const [year, month] = selectedDate.split('-').map(Number);
        const daysInMonth = getDaysInMonth(year, month - 1);
        let monthData = [];
        
        for (let day = 1; day <= daysInMonth; day++) {
          const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const currentDateObj = new Date(date);
          
          if (currentDateObj <= currentDate) {
            // Передаем прогресс за каждый день в fetchDataForDate
            const dayData = await fetchDataForDate(date, 100 / daysInMonth);
            monthData.push({ date, phones: dayData });
          } else {
            monthData.push({ date, phones: [] });
          }
          
          // Прогресс по дням
          setProgress(prev => Math.min(100, prev + (100 / daysInMonth)));
          
          if (day < daysInMonth && currentDateObj <= currentDate) {
            await delay(500);
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
