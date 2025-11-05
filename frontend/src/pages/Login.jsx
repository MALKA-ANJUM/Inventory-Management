import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

export default function Login({ setToken }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axiosClient.post('/login', { email, password });
			console.log('Login success:', data);

			setToken(data.token); // ✅ update app state
			navigate('/products'); // ✅ now works
		} catch (err) {
			console.error('Login error:', err.response?.data);
			setError('Invalid credentials');
		}
	};

	return (
		<div className="auth-wrapper d-flex justify-content-center align-items-center vh-100">
			<div className="auth-card shadow-lg p-4 rounded-4 bg-white">
				<div className="text-center mb-4">
					<h2 className="text-success fw-bold">Welcome Back</h2>
					<p className="text-muted">Login to manage your inventory</p>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label className="form-label fw-semibold text-success">Email</label>
						<input
						type="email"
						className="form-control"
						placeholder="Enter your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div className="mb-3">
						<label className="form-label fw-semibold text-success">Password</label>
						<input
						type="password"
						className="form-control"
						placeholder="Enter your password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					{error && <div className="text-danger mb-3">{error}</div>}

					<button type="submit" className="btn btn-success w-100 py-2 fw-semibold shadow-sm">
						Login
					</button>
				</form>

				<div className="text-center mt-3">
					<p className="text-muted mb-0">
						Don’t have an account?{' '}
						<span
						className="text-success fw-semibold"
						style={{ cursor: 'pointer' }}
						onClick={() => navigate('/register')}
						>
						Register
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}
