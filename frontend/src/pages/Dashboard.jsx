import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

	return (
		<div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
			<h1 className="display-5 fw-bold text-success mb-3">
				Inventory Management App
			</h1>
			<p className="lead text-muted mb-4">
				Manage your products, stock, and variants efficiently.
			</p>

			<button
				className="btn btn-success px-4 py-2 fw-semibold shadow-sm"
				onClick={() => navigate('/login')}
			>
				Go to Login
			</button>
		</div>
	);
}
