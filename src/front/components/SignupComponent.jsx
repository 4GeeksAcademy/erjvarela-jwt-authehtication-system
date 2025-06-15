import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignupComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        if (!email || !password || !confirmPassword) {
            setMessage({ text: 'All fields are required.', type: 'danger' });
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setMessage({ text: 'Passwords do not match.', type: 'danger' });
            setIsLoading(false);
            return;
        }

        try {
            const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/signup`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create account.');
            }

            setMessage({ text: 'Account created successfully! Redirecting to login...', type: 'success' });

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            setMessage({ text: error.message, type: 'danger' });
            setIsLoading(false);
        }
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow-sm" style={{ width: '24rem' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Create Account</h2>

                    {message.text && (
                        <div className={`alert alert-${message.type}`} role="alert">
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSignup}>
                        <div className="mb-3">
                            <label htmlFor="emailInput" className="form-label">Email address</label>
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
                            <label htmlFor="passwordInput" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="passwordInput"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPasswordInput"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span className="ms-2">Creating Account...</span>
                                    </>
                                ) : (
                                    'Sign Up'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-3">
                        <small className="text-muted">
                            Already have an account? <Link to="/">Log In</Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupComponent;