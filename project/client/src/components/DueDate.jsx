import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PropTypes from 'prop-types';

export default function DueDate({ id, dueDate, refreshTodos }) {
  const [selectedDate, setSelectedDate] = React.useState(dueDate ? dayjs(dueDate) : null);

  React.useEffect(() => {
    if (dueDate) {
      setSelectedDate(dayjs(dueDate));
    }
  }, [dueDate]);

  const updateDueDateOnServer = async (newDate) => {
    try {
      const formattedDate = newDate.format('YYYY-MM-DD'); 
      const response = await fetch(`/api/todos/update-due-date/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ due_date: formattedDate }),
      });

      if (!response.ok) {
        throw new Error('Failed to update due date');
      }

      refreshTodos(); 
    } catch (error) {
      console.error('Error updating due date:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={selectedDate}
        onChange={(newValue) => {
          if (newValue) {
            setSelectedDate(newValue);
            updateDueDateOnServer(newValue);
          }
        }}
        format="YYYY-MM-DD"
        slotProps={{ textField: { variant: "outlined", size: "small" } }}
      />
    </LocalizationProvider>
  );
}

DueDate.propTypes = {
  id: PropTypes.number.isRequired,
  dueDate: PropTypes.string,
  refreshTodos: PropTypes.func.isRequired,
};