// Frontend (React + Tailwind CSS + Axios)

import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const App = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [profile, setProfile] = useState(null);

    const handleSignUp = async () => {
        try {
            await axios.post('http://localhost:5000/signup', { username, password });
            setMessage('Sign-up successful!');
        } catch (error) {
            setMessage('Error signing up');
        }
    };

    const handleSignIn = async () => {
        try {
            await axios.post('http://localhost:5000/signin', { username, password });
            setMessage('Sign-in successful!');
        } catch (error) {
            setMessage('Invalid credentials');
        }
    };

    const handleLogout = async () => {
        await axios.post('http://localhost:5000/logout');
        setProfile(null);
        setMessage('Logged out successfully');
    };

    const fetchProfile = async () => {
        try {
            const res = await axios.get('http://localhost:5000/profile');
            setProfile(res.data.message);
        } catch (error) {
            setProfile(null);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">JWT Authentication</h1>
            <div className="bg-white p-6 rounded-lg shadow-md w-80">
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="w-full p-2 mb-2 border rounded" 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full p-2 mb-2 border rounded" 
                />
                <button 
                    onClick={handleSignUp} 
                    className="w-full bg-blue-500 text-white p-2 rounded mb-2 hover:bg-blue-600"
                >
                    Sign Up
                </button>
                <button 
                    onClick={handleSignIn} 
                    className="w-full bg-green-500 text-white p-2 rounded mb-2 hover:bg-green-600"
                >
                    Sign In
                </button>
                <button 
                    onClick={fetchProfile} 
                    className="w-full bg-yellow-500 text-white p-2 rounded mb-2 hover:bg-yellow-600"
                >
                    View Profile
                </button>
                <button 
                    onClick={handleLogout} 
                    className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
                <p className="text-center mt-4 text-gray-700">{message}</p>
                {profile && <h2 className="text-center font-bold mt-2">{profile}</h2>}
            </div>
        </div>
    );
};

export default App;
