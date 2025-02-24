import { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import ReactCalendar from 'react-calendar';

interface CalendarProps {
  completedDates: string[];
  onUpdateCompletedDates: (updatedDates: string[]) => void; // Add this function to handle real-time updates
}

const CalendarComponent = ({ completedDates, onUpdateCompletedDates }: CalendarProps) => {
  const [date, setDate] = useState<Date | [Date, Date] | null>(new Date());
  const [dates, setDates] = useState(completedDates); // Store completed dates in state
  const formattedDates = dates.map(date => {
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0]; // Extracts YYYY-MM-DD
  });

  const normalizeDate = (d: Date) => d.toISOString().split('T')[0];

  const tileClassName = ({ date }: { date: Date }) => {
    const normalizedDate = normalizeDate(date);
    console.log({
      formattedDates,
      normalizedDate
    });
    return formattedDates.includes(normalizedDate) ? 'completed' : '';
  };

  const handleDateChange = (newDate: Date | [Date, Date] | null) => {
    setDate(newDate);
  };

  

  return (
    <div>
      <div className="calendar">
        <ReactCalendar
          value={date}
          tileClassName={tileClassName}
        />
      </div>
      <style>
        {`
          .completed {
            background-color: #4caf50;
            color: white;
          }
        `}
      </style>
    </div>
  );
};

export default CalendarComponent;
