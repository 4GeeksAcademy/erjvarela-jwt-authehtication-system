import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export const Navbar = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		setIsAuthenticated(!!localStorage.getItem("token"));
		const onStorage = () => setIsAuthenticated(!!localStorage.getItem("token"));
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		setIsAuthenticated(false);
		navigate("/login");
	};

	const isPrivateRoute = location.pathname === "/private";

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container-fluid">
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
					aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav me-auto"></ul>
					<div className="d-flex">
						{isAuthenticated && isPrivateRoute ? (
							<button className="btn btn-danger" onClick={handleLogout}>
								Logout
							</button>
						) : (
							<>
								<Link to="/login" className="btn btn-outline-primary me-2">
									Login
								</Link>
								<Link to="/signup" className="btn btn-primary">
									Signup
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};