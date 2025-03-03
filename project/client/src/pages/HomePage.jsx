
import NavBar from '../components/NavBar';
import TextZadani from '../components/TextZadani';
import Filtry from '../components/Filtry';
import ToDosList from '../components/ToDosList';
import RootLayout from '../layout/RootLayout';
import { useEffect, useCallback, useState } from 'react';
import { useSetTodos, useSetRefreshTodos } from '../stores/todos';

export default function HomePage() {
    const setTodos = useSetTodos();
    const setRefreshTodos = useSetRefreshTodos();
    const user_id = localStorage.getItem('user_id');

    const fetchData = useCallback(async () => {
        if (!user_id) {
            console.error('No user_id found, cannot fetch todos.');
            return;
        }

        try {
            console.log(`Fetching todos for user_id: ${user_id}...`);
            const response = await fetch(`/api/todos?user_id=${user_id}`);
            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to fetch todos');
            }

            console.log('Updated todos:', data.todos);
            setTodos(data.todos); 
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }, [setTodos, user_id]);

    const refreshTodos = useCallback(async () => {
        try {
            console.log('Refreshing todos...');
            await fetchData();
        } catch (error) {
            console.error('Error refreshing todos:', error);
        }
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setRefreshTodos(refreshTodos);
    }, [refreshTodos, setRefreshTodos]);

    const [ filter ,setFilter] = useState('all');



    return (
        <RootLayout>
            <NavBar/>
            <TextZadani/>
            <Filtry setFilter={setFilter}/>
            <ToDosList filter={filter}  />
        </RootLayout>
    );
}