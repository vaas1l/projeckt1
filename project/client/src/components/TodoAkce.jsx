import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useRefreshTodos } from '../stores/todos';
import PropTypes from 'prop-types';

const options = [
  { label: 'High', value: 1 },
  { label: 'Average', value: 2 },
  { label: 'Low', value: 3 }
];

export default function TodoAkce({ id, priority }) {
  const refreshTodos = useRefreshTodos();

  const [value, setValue] = React.useState(
    options.find((option) => option.value === priority) || options[1]
  );

  React.useEffect(() => {
    console.log('Priority updated from DB:', priority);
    const foundOption = options.find((option) => option.value === priority);
    setValue(foundOption || options[1]);
  }, [priority]);

  const updatePriorityOnServer = async (newPriority) => {
    console.log('Sending update:', { id, newPriority });

    try {
      const response = await fetch(`/api/todos/update-priority/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority }),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(`Failed to update priority: ${data.message}`);
      }

      refreshTodos(); 
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (newValue) {
          console.log('Selected new value:', newValue);
          setValue(newValue);
          updatePriorityOnServer(newValue.value);
        }
      }}
      id="todo-priority-autocomplete"
      options={options}
      getOptionLabel={(option) => option.label}
      sx={{ width: 150 }}
      renderInput={(params) => <TextField {...params} label="Priority" />}
    />
  );
}

TodoAkce.propTypes = {
  id: PropTypes.number.isRequired,
  priority: PropTypes.number.isRequired,
};