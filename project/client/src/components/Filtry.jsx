import { useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import PropTypes from 'prop-types';
import { useRefreshTodos } from '../stores/todos';

export default function Filtry({ setFilter }) {
    const refreshTodos = useRefreshTodos();
    const [activeFilter, setActiveFilter] = useState('all');

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setFilter(filter);
        refreshTodos(); 
    };

    return (
        <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{ marginBottom: 2 }}>
            <Button onClick={() => handleFilterChange('all')} color={activeFilter === 'all' ? 'primary' : 'inherit'}>ALL</Button>
            <Button onClick={() => handleFilterChange('done')} color={activeFilter === 'done' ? 'primary' : 'inherit'}>DONE</Button>
            <Button onClick={() => handleFilterChange('not_done')} color={activeFilter === 'not_done' ? 'primary' : 'inherit'}>NOT DONE</Button>
            <Button onClick={() => handleFilterChange('priority')} color={activeFilter === 'priority' ? 'primary' : 'inherit'}>PRIORITY</Button>
        </ButtonGroup>
    );
}

Filtry.propTypes = {
    setFilter: PropTypes.func.isRequired,
};