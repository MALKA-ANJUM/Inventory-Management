import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import './index.css';

function App() {
	// 🔹 Keep token in state so React can re-render when it changes
	const [token, setToken] = useState(localStorage.getItem('token'));

	// 🔹 Whenever token changes, sync it to localStorage
	useEffect(() => {
		if (token) localStorage.setItem('token', token);
		else localStorage.removeItem('token');
	}, [token]);

	return (
		<BrowserRouter>
			<div className="app-container d-flex flex-column min-vh-100">
				{token && <Header />}

				<main className="flex-grow-1">
					<Routes>
						<Route path="/" element={<Dashboard />} />

						{/* 🔹 Pass setToken to Login so it can update the token */}
						<Route path="/login" element={<Login setToken={setToken} />} />
						<Route path="/register" element={<Register />} />

						{/* 🔹 Protected route */}
						<Route
						path="/products"
						element={token ? <Products /> : <Navigate to="/login" />}
						/>

						<Route path="*" element={<Navigate to="/" />} />
					</Routes>
				</main>

				{token && <Footer />}
			</div>
		</BrowserRouter>
	);
}

export default App;
