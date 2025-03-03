import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRefreshTodos } from '../stores/todos';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const setRefreshTodos = useSetRefreshTodos();

    const handleSubmit = (event) => {
        event.preventDefault();
        setError(null);

        const user_id = "123"; 

        localStorage.setItem('user_id', user_id);
        console.log('user_id saved:', localStorage.getItem('user_id'));


        setRefreshTodos();

        navigate('/');
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email" 
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required 
                />
                <button type="submit">Sign in</button>
            </form>
        </div>
    );
}