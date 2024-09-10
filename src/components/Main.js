import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import TapBut from './TapBut';
import * as XLSX from 'xlsx';

const MainContainer = styled.main`
  margin-top: 70px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  align-items: center;
  background-color: #272a2f;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  color: white;
  margin-bottom: 1rem;
`;

const DateInput = styled.div`
  background-color: white;
  color: black;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
`;

const CalendarContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const MonthYearDisplay = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
`;

const WeekdayHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 8px;
`;

const Weekday = styled.div`
  text-align: center;
  font-weight: bold;
  color: #555;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

const DayCell = styled.div`
  text-align: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  font-weight: bold;
  color: ${props => props.$isCurrentMonth ? '#333' : '#aaa'};
  background-color: ${props => props.$isSelected ? '#4CAF50' : 'transparent'};
  color: ${props => props.$isSelected ? 'white' : props.$isCurrentMonth ? '#333' : '#aaa'};
  transition: background-color 0.3s;
  &:hover {
    background-color: ${props => props.$isSelected ? '#4CAF50' : '#f0f0f0'};
  }
`;

const IdWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 400px;
  overflow: auto;
`;
const InputKey = styled.input`
  display: flex;
  flex-direction: column;
  margin: 10px;
  padding: 10px;
  width: 100px;
  height: 25px;
  border-radius: 10px;
  overflow: auto;
`;
const ExportButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    background-color: #45a049;
  }
`;
const Calendar = ({ selectedDate, onDateSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    for (let i = 1; i < firstDay.getDay() || i === 7; i++) {
      days.push(new Date(year, month, 1 - i));
    }
    days.reverse();
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(year, month + 1, i));
      }
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <NavButton onClick={handlePrevMonth}>&lt;</NavButton>
        <MonthYearDisplay>
          {currentMonth.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}
        </MonthYearDisplay>
        <NavButton onClick={handleNextMonth}>&gt;</NavButton>
      </CalendarHeader>
      <WeekdayHeader>
        {weekdays.map(day => <Weekday key={day}>{day}</Weekday>)}
      </WeekdayHeader>
      <DaysGrid>
        {days.map((day, index) => (
          <DayCell
            key={index}
            $isCurrentMonth={day.getMonth() === currentMonth.getMonth()}
            $isSelected={formatDate(day) === selectedDate}
            onClick={() => {
              onDateSelect(formatDate(day));
              onClose();
            }}
          >
            {day.getDate()}
          </DayCell>
        ))}
      </DaysGrid>
    </CalendarContainer>
  );
};

const Main = () => {
  const [secretKey, setSecretKey] = useState('')
  const [chechKey, setChechKey] = useState('Нажмите создать чтобы проверитьь код')
  const [phones, setPhones] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setIsCalendarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet(phones.map(phone => [phone]));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Phones");
    
    // Generate buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    // Save to file
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phone_numbers_${selectedDate}.xlsx`;
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
  };

  return (
    <MainContainer>
      <Row>
        <InputKey
        placeholder='Введите секретный ключ'
        value={secretKey}
        onChange={e => setSecretKey(e.target.value)}
        />
          <div>
            {chechKey}
            </div>
      </Row>
      <Row>
        <div>СОЗДАТЬ ТАБЛИЦУ НА &nbsp;</div>
        <DateInput onClick={() => setIsCalendarOpen(true)}>
          {selectedDate}
        </DateInput>
      </Row>
      <Row>
        <TapBut selectedDate={selectedDate} setPhones={setPhones} secretKey={secretKey} setChechKey={setChechKey} />
      </Row>
      <Row>
        <IdWrapper>
          {phones.map((phone, index) => (
            <p key={index}>
              {index + 1}: {phone}
            </p>
          ))}
        </IdWrapper>
      </Row>
      {phones.length > 0 && (
        <ExportButton onClick={exportToExcel}>
          Экспортировать в Excel
        </ExportButton>
      )}
      {isCalendarOpen && (
        <div ref={calendarRef}>
          <Calendar 
            selectedDate={selectedDate} 
            onDateSelect={handleDateSelect}
            onClose={() => setIsCalendarOpen(false)}
          />
        </div>
      )}
    </MainContainer>
  );
};

export default Main;