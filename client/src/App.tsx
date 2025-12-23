import React, { useState, useEffect } from 'react';
import DeskGrid from './components/DeskGrid';
import { User } from './types';
import './App.css';

const DEFAULT_USERS: User[] = [
    { id: 'user-1', fullName: 'Ignas' },
    { id: 'user-2', fullName: 'Monika' },
    { id: 'user-3', fullName: 'Andrius' }
];

const App: React.FC = () => {
    // Load users from localStorage or use defaults
    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem('deskbooker_users');
        return saved ? JSON.parse(saved) : DEFAULT_USERS;
    });

    // Load active user from localStorage or use the first one
    const [currentUser, setCurrentUser] = useState<User>(() => {
        const saved = localStorage.getItem('deskbooker_current_user');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Verify the user still exists in the users list
            const exists = users ? users.some(u => u.id === parsed.id) : DEFAULT_USERS.some(u => u.id === parsed.id);
            return exists ? parsed : (users ? users[0] : DEFAULT_USERS[0]);
        }
        return users ? users[0] : DEFAULT_USERS[0];
    });

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [newUserName, setNewUserName] = useState('');

    // Save users to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('deskbooker_users', JSON.stringify(users));
    }, [users]);

    // Save current user to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('deskbooker_current_user', JSON.stringify(currentUser));
    }, [currentUser]);

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserName.trim()) return;
        const newUser = {
            id: `user-${Date.now()}`,
            fullName: newUserName
        };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        setNewUserName('');
    };

    return (
        <div className="app-wrapper">
            <nav className="navbar">
                <div className="nav-content">
                    <span className="logo">DeskBooker</span>
                    <div className="user-section">
                        <div
                            className="user-profile"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <img src={`https://ui-avatars.com/api/?name=${currentUser.fullName}&background=6366f1&color=fff`} alt="User" />
                            <span>{currentUser.fullName}</span>
                            <svg className={showUserMenu ? 'open' : ''} viewBox="0 0 24 24" width="16" height="16">
                                <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {showUserMenu && (
                            <div className="user-dropdown">
                                <div className="user-list">
                                    {users.map(u => (
                                        <div
                                            key={u.id}
                                            className={`user-item ${u.id === currentUser.id ? 'active' : ''}`}
                                            onClick={() => {
                                                setCurrentUser(u);
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            {u.fullName}
                                        </div>
                                    ))}
                                </div>
                                <form className="add-user-form" onSubmit={handleAddUser}>
                                    <input
                                        type="text"
                                        placeholder="Pridėti vartotoją..."
                                        value={newUserName}
                                        onChange={(e) => setNewUserName(e.target.value)}
                                    />
                                    <button type="submit">+</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <main>
                <DeskGrid currentUser={currentUser} />
            </main>
            <footer className="footer">
                <p>&copy; 2025 DeskBooker System. Technical Task.</p>
            </footer>
        </div>
    );
};

export default App;
