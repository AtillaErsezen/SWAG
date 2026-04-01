import React, { createContext, useContext, useState } from 'react';
import { translations, languages } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [workerId, setWorkerId] = useState(null);
    const [trainingCount, setTrainingCount] = useState(0);
    const [currentLang, setCurrentLang] = useState('en');
    const [activeMachineId, setActiveMachineId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const t = (key) => {
        return translations[currentLang]?.[key] || translations['en'][key] || key;
    };

    /** Called after a successful backend login. count comes from the API response. */
    const login = (id, count = 0) => {
        setWorkerId(id);
        setTrainingCount(count);
    };

    const logout = () => {
        setWorkerId(null);
        setTrainingCount(0);
    };

    const changeLanguage = (code) => setCurrentLang(code);
    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return (
        <AppContext.Provider value={{
            workerId,
            trainingCount,
            setTrainingCount,
            login,
            logout,
            currentLang,
            changeLanguage,
            availableLanguages: languages,
            t,
            activeMachineId,
            setActiveMachineId,
            sidebarOpen,
            setSidebarOpen,
            toggleSidebar
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
