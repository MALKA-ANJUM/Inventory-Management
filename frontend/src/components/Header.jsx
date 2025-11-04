import { useNavigate } from 'react-router-dom';

export default function Header() {
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/login');
	};

	return (
		<header className="header bg-success text-white py-3 shadow-sm">
			<div className="container d-flex justify-content-between align-items-center">
				<h4
					className="m-0 fw-bold"
					style={{ cursor: 'pointer' }}
					onClick={() => navigate(token ? '/products' : '/login')}
				>
					Inventory Panel
				</h4>

				<nav>
					{token ? (
						<button
							className="btn btn-light btn-sm fw-semibold px-3"
							onClick={handleLogout}
						>
							Logout
						</button>
					) : (
						<>
							<button
								className="btn btn-outline-light btn-sm fw-semibold px-3 me-2"
								onClick={() => navigate('/login')}
							>
								Login
							</button>
							<button
								className="btn btn-light btn-sm fw-semibold px-3"
								onClick={() => navigate('/register')}
							>
								Register
							</button>
						</>
					)}
				</nav>
			</div>
		</header>
	);
}
