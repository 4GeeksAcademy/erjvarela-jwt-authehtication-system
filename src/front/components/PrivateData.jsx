import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const PrivateData = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }
        , [navigate]);
    return (
        <div className="container mt-5">
            <h1>Private Data</h1>
            <p>I am making practice for some private Data. Hello there.</p>
        </div>
    );
}
