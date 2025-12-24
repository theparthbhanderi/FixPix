import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Button from '../components/ui/Button';
import MaterialCard from '../components/ui/MaterialCard';

const SettingsPage = () => {
    const { user, logoutUser } = useContext(AuthContext);

    return (
        <div className="p-8 w-full">
            <h1 className="text-2xl font-bold text-text-main mb-6">Settings</h1>

            <MaterialCard className="max-w-md">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                        {user ? user.username[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-text-main">{user ? user.username : 'Guest'}</h2>
                        <p className="text-text-secondary">{user ? user.email : 'guest@example.com'}</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-border-light">
                    <Button variant="outline" className="w-full text-red-500 hover:bg-red-50 border-red-200" onClick={logoutUser}>
                        Logout
                    </Button>
                </div>
            </MaterialCard>
        </div>
    );
};

export default SettingsPage;
