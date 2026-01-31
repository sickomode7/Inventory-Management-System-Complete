import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as authService from '../api/auth';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default to 'user'
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await authService.register(username, email, password, [role]);
            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="card w-full max-w-md p-8 shadow-lg">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h1>
                    <p className="text-slate-500">Inventory Management System</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm font-medium border border-red-200">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 text-sm font-medium border border-green-200">
                        {success}
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
                        <label className="label">Email</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
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

                    <div className="input-group">
                        <label className="label">Role</label>
                        <select
                            className="input"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="user">Staff (User)</option>
                            <option value="admin">Manager (Admin)</option>
                        </select>
                        <p className="text-xs text-slate-400 mt-1">Select 'Manager' for full access.</p>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-4 py-2.5"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-slate-500">Already have an account? </span>
                    <Link to="/login" className="text-slate-900 font-bold hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
