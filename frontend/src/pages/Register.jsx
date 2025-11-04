import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axiosClient.post("/register", form);
            localStorage.setItem("token", data.token);
            navigate("/products");
        } catch {
            alert("Registration failed");
        }
    };

    return (
        <div className="auth-wrapper d-flex justify-content-center align-items-center vh-100">
            <div className="auth-card shadow-lg p-4 rounded-4 bg-white">
                <div className="text-center mb-4">
                    <h2 className="text-success fw-bold">Register Now </h2>
                </div>

                <form onSubmit={handleSubmit}>
                <input
                    className="form-control mb-2"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange} required
                />

                <input
                    className="form-control mb-2"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange} required
                />

                <input
                    type="password"
                    className="form-control mb-2"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange} required
                />

                <input
                    type="password"
                    className="form-control mb-2"
                    name="password_confirmation"
                    placeholder="Confirm Password"
                    onChange={handleChange} required
                />

                <button className="btn btn-success w-100">Register</button>
                </form>
                <div className="text-center mt-3">
                <p className="text-muted mb-0">
                    Already have an account?{" "}
                    <span
                    className="text-success fw-semibold pointer"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/login")}
                    >
                    Login
                    </span>
                </p>
                </div>
            </div>
        </div>
    );
}
