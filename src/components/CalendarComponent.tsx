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

  useEffect(() => {
    console.log(`Completed Dats: ${completedDates}`); 
    // Whenever the completedDates prop changes, update the local state and notify parent
    setDates(completedDates);
  }, [completedDates]);

  const normalizeDate = (d: Date) => d.toISOString().split('T')[0];

  const tileClassName = ({ date }: { date: Date }) => {
    const normalizedDate = normalizeDate(date);
    return dates.includes(normalizedDate) ? 'completed' : '';
  };

  const handleDateChange = (newDate: Date | [Date, Date] | null) => {
    setDate(newDate);
  };

  const handleTileClick = (date: Date) => {
    const normalizedDate = normalizeDate(date);

    // Toggle completed status of the clicked date
    let updatedDates = [...dates];
    if (updatedDates.includes(normalizedDate)) {
      updatedDates = updatedDates.filter((d) => d !== normalizedDate); // Remove the date if already marked
    } else {
      updatedDates.push(normalizedDate); // Add the date if not marked
    }

    // Update the state and notify the parent with the updated list of dates
    setDates(updatedDates);
    onUpdateCompletedDates(updatedDates);
  };

  return (
    <div>
      <div className="calendar">
        <ReactCalendar
          value={date}
          tileClassName={tileClassName}
          onClickDay={handleTileClick} // Handle click on a tile to toggle completed status
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
