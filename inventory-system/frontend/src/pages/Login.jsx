import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="card w-full max-w-md p-8 shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">IRON & CEMENT</h1>
                    <p className="text-slate-500">Inventory Management System</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm font-medium border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="label">Username</label>
                        <input
                            type="text"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="input-group">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-4 py-2.5">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-slate-500">Don't have an account? </span>
                    <Link to="/signup" className="text-slate-900 font-bold hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
