import React from 'react';

interface DateSelectorProps {
  availableDates: Date[];
  selectedDate: string;
  onDateSelect: (dateString: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  availableDates, 
  selectedDate, 
  onDateSelect 
}) => {
  const today = new Date();
  
  // Generate next 7 days starting from today
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const getDayName = (date: Date) => {
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return dayNames[date.getDay()];
  };

  const getMonthName = (date: Date) => {
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                       'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return monthNames[date.getMonth()];
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="date-selector-container">
      <div className="date-selector-header">
        <span className="language-format">English - 2D</span>
        <div className="filter-options">
          <select className="filter-select">
            <option>Price Range</option>
          </select>
          <select className="filter-select">
            <option>Special Formats</option>
          </select>
          <select className="filter-select">
            <option>Preferred Time</option>
          </select>
          <select className="filter-select">
            <option>Sort By</option>
          </select>
        </div>
      </div>
      
      <div className="date-tabs">
        {dateOptions.map((date, index) => (
          <button
            key={index}
            className={`date-tab ${selectedDate === date.toDateString() ? 'active' : ''} ${isToday(date) ? 'today' : ''}`}
            onClick={() => onDateSelect(date.toDateString())}
          >
            <div className="day-name">{getDayName(date)}</div>
            <div className="date-number">{date.getDate()}</div>
            <div className="month-name">{getMonthName(date)}</div>
          </button>
        ))}
      </div>
      
      <div className="availability-legend">
        <div className="legend-item">
          <span className="legend-dot available"></span>
          <span>AVAILABLE</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot fast-filling"></span>
          <span>FAST FILLING</span>
        </div>
      </div>
    </div>
  );
};

export default DateSelector;