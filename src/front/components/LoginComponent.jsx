import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        if (!email || !password) {
            setMessage({ text: 'Please enter both email and password.', type: 'danger' });
            setIsLoading(false);
            return;
        }

        try {
            const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/login`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to login. Please check your credentials.');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                navigate('/private');
            } else {
                throw new Error('No token received from server.');
            }

        } catch (error) {
            setMessage({ text: error.message, type: 'danger' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow-sm" style={{ width: '24rem' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Login</h2>

                    {message.text && (
                        <div className={`alert alert-${message.type}`} role="alert">
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="emailInput" className="form-label">
                                Email address
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="emailInput"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="passwordInput" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="passwordInput"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span className="ms-2">Logging in...</span>
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;