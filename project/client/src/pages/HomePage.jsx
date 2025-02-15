import NavBar from '../components/NavBar';
import TextZadani from '../components/TextZadani';
import Filtry from '../components/Filtry';
import ToDosList from '../components/ToDosList';
import axios from 'axios';
import RootLayout from '../layout/RootLayout';
import React, { useEffect } from 'react';

export default function HomePage() {
   const [todos, setTodos] = React.useState([]);
   useEffect(() => {
     const fetchData = async () => {
       const response = await axios.get('/api/todos');
       const data = response.data;
       setTodos(data);
     };
      fetchData();
   }, [])
   
    return (
        <RootLayout>
            <NavBar />
            <TextZadani />
            <Filtry />
            <ToDosList todos={todos} setTodos={setTodos} />
            
        </RootLayout>
    )
}
