import NavBar from '../components/NavBar';
import TextZadani from '../components/TextZadani';
import Filtry from '../components/Filtry';
import ToDosList from '../components/ToDosList';
import RootLayout from '../layout/RootLayout';
import { useEffect, useCallback } from 'react';
import { useSetTodos, useSetRefreshTodos } from '../stores/todos';

export default function HomePage() {
    const setTodos = useSetTodos();
    const setRefreshTodos = useSetRefreshTodos();

    const fetchData = useCallback(async () => {
        try {
            console.log('Fetching updated todos...');
            const response = await fetch('/api/todos');
            const data = await response.json();
            console.log('Updated todos:', data);
            setTodos(data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }, [setTodos]);

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

    return (
        <RootLayout>
            <NavBar />
            <TextZadani/>
            <Filtry />
            <ToDosList />
        </RootLayout>
    );
}