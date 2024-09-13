import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import TapBut from './TapBut';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
const StyledLink = styled(Link)`
  padding: 10px;
  border-radius: 10px;
  text-decoration: none;
  color: white;
  background-color: ${props => props.$isActive ? '#153277' : '#2751B7'};
  margin: 0 10px;
  transition: all 0.2s;
  &:hover {
    background-color: #153277;
  }
  &:active {
    background-color: #153277;
  }
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
  height: 200px;
  overflow: auto;
  border-radius: 10px;
  padding: 10px 15px;
  background-color: #1e1e1e; // Dark background to match the site theme

  /* Webkit browsers like Chrome, Safari */
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #2c2c2c;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4a4a4a;
    border-radius: 6px;
    border: 3px solid #2c2c2c;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #5a5a5a;
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #4a4a4a #2c2c2c;
`;
const InputKey = styled.input`
  display: flex;
  flex-direction: column;
  margin: 10px;
  padding: 10px;
  width: 160px;
  justify-content: center;
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
const MonthSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  background-color: white;
  color: black;
  cursor: pointer;
`;
const DayNavigation = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;
const NavButton = styled.button`
  background: none;
  border: none;
  color: #ff0000;
  font-size: 24px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DateDisplay = styled.span`
  margin: 0 1rem;
  font-size: 18px;
  color: white;
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

const Main = ({setProgress}) => {
  const location = useLocation()
  const isDay = location.pathname === '/day'
  const [secretKey, setSecretKey] = useState('')
  const [chechKey, setChechKey] = useState('Нажмите "Создать" чтобы проверить ключ')
  const [phones, setPhones] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

const availableMonths = months.slice(0, currentMonth + 1);

  const handleMonthSelect = (event) => {
    const selectedMonth = event.target.value;
    const monthIndex = months.indexOf(selectedMonth);
    const year = new Date().getFullYear();
    setSelectedDate(`${year}-${String(monthIndex + 1).padStart(2, '0')}-01`);
  };

  const handlePrevDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  const handleNextDay = () => {
    if (currentDayIndex < phones.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

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
    const workbook = new ExcelJS.Workbook();
    
    const createSheet = (data, sheetName) => {
      const worksheet = workbook.addWorksheet(sheetName);
  
      // Заголовки
      worksheet.columns = [
        { header: 'Спам', key: 'phone', width: 15 },
        { header: 'Комментарий', key: 'comment', width: 30 },
      ];
  
      // Форматирование заголовков
      worksheet.getRow(1).font = { bold: true };
  
      // Добавление данных
      data.forEach((phone, index) => {
        worksheet.addRow({ phone, comment: '' });
  
        // Применение пунктирных границ к строке с номером
        const row = worksheet.getRow(index + 2); // Сдвиг на 2, чтобы пропустить заголовки
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = {
            top: { style: 'dotted' },
            left: { style: 'dotted' },
            bottom: { style: 'dotted' },
            right: { style: 'dotted' },
          };
        });
      });
    };
  
    if (isDay) {
      // Экспорт данных за один день
      if (phones.length > 0 && phones[0] && phones[0].phones) {
        createSheet(phones[0].phones, phones[0].date);
      }
  
      const fileName = `phone_numbers_${selectedDate}.xlsx`;
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, fileName);
      });
    } else {
      // Экспорт данных за весь месяц
      phones.forEach((dayData) => {
        if (dayData && dayData.phones) {
          createSheet(dayData.phones, dayData.date);
        }
      });
  
      const [year, month] = selectedDate.split('-');
      const monthName = new Date(year, month - 1, 1).toLocaleString('ru-RU', { month: 'long' });
      const fileName = `phone_numbers_${monthName}_${year}.xlsx`;
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, fileName);
      });
    }
  };

  return (
    <MainContainer>
      <Row>
        <StyledLink $isActive={isDay} to={'/day'}>Создать таблицу на день</StyledLink>
        <StyledLink $isActive={!isDay} to={'/month'}>Создать таблицу на месяц</StyledLink>
      </Row>
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
        <div>{
          isDay ?
          'ВЫБЕРИТЕ ДАТУ НА КОТОРУЮ СОЗДАТЬ ТАБЛИЦУ'
          :
          'ВЫБЕРИТЕ МЕСЯЦ НА КОТОРЫЙ СОЗДАТЬ ТАБЛИЦУ'} &nbsp;
        </div>
        {
          isDay ?
          <DateInput onClick={() => setIsCalendarOpen(true)}>
            {selectedDate}
          </DateInput>
          :
          <MonthSelect onChange={handleMonthSelect} value={months[new Date(selectedDate).getMonth()]}>
            {availableMonths.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </MonthSelect>
        }
      </Row>
      <Row>
        <TapBut 
          selectedDate={selectedDate} 
          setPhones={setPhones} 
          secretKey={secretKey} 
          setChechKey={setChechKey} 
          isDay={isDay} 
          setProgress={setProgress}
          currentDate={currentDate}
        />
      </Row>
      {isDay ? (
        // Отображение для режима "день"
        <Row>
          <IdWrapper>
            {phones.length > 0 && phones[0] && phones[0].phones ? (
              <div>
                <p>Дата: {phones[0].date}</p>
                {phones[0].phones.map((phone, phoneIndex) => (
                  <p key={phoneIndex}>
                    {phoneIndex + 1}: {phone}
                  </p>
                ))}
              </div>
            ) : (
              <p>Нет данных для отображения</p>
            )}
          </IdWrapper>
        </Row>
      ) : (
        // Отображение для режима "месяц"
        <>
          <DayNavigation>
            <NavButton onClick={handlePrevDay} disabled={currentDayIndex === 0 || phones.length === 0}>
              <ChevronLeft />
            </NavButton>
            <DateDisplay>
              {phones.length > 0 && phones[currentDayIndex] 
                ? phones[currentDayIndex].date 
                : selectedDate}
            </DateDisplay>
            <NavButton onClick={handleNextDay} disabled={currentDayIndex === phones.length - 1 || phones.length === 0}>
              <ChevronRight />
            </NavButton>
          </DayNavigation>
          <Row>
            <IdWrapper>
              {phones.length > 0 && phones[currentDayIndex] && phones[currentDayIndex].phones ? (
                phones[currentDayIndex].phones.map((phone, index) => (
                  <p key={index}>
                    {index + 1}: {phone}
                  </p>
                ))
              ) : (
                <p>Нет данных для отображения</p>
              )}
            </IdWrapper>
          </Row>
        </>
      )}
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