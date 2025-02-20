import NavBar from '../components/NavBar';
import TextZadani from '../components/TextZadani';
import Filtry from '../components/Filtry';
import ToDosList from '../components/ToDosList';
import RootLayout from '../layout/RootLayout';
import React, { useEffect } from 'react';

export default function HomePage() {
   const [todos, setTodos] = React.useState([]);

   const fetchData = async () => {
    try {
        console.log('Fetching updated todos...'); 
        const response = await fetch('/api/todos');
        const data = await response.json();
        console.log('Updated todos:', data);
        setTodos(data);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
};

   useEffect(() => {
      fetchData();
   }, []);

    return (
        <RootLayout>
            <NavBar />
            <TextZadani refreshTodos={fetchData} />
            <Filtry />
            <ToDosList todos={todos} setTodos={setTodos} />
        </RootLayout>
    );
}