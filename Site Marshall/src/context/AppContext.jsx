import { createContext, useContext, useState, useEffect } from 'react';
import { translations, languages, constructionSites } from '../data/mockData';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [session, setSession]           = useState(null);
    const [userRole, setUserRole]         = useState(null);
    const [loading, setLoading]           = useState(true);
    const [trainingCount, setTrainingCount] = useState(0);
    const [currentLang, setCurrentLang]   = useState('en');
    const [activeMachineId, setActiveMachineId] = useState(null);
    const [activeSite, setActiveSite]     = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUserRole(session?.user?.user_metadata?.role ?? 'worker');
            setLoading(false);
        }).catch(() => setLoading(false));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUserRole(session?.user?.user_metadata?.role ?? 'worker');
        });

        return () => subscription.unsubscribe();
    }, []);

    const t = (key) =>
        translations[currentLang]?.[key] || translations['en'][key] || key;

    const logout = () => supabase.auth.signOut();

    const changeLanguage = (code) => setCurrentLang(code);

    return (
        <AppContext.Provider value={{
            session,
            user: session?.user ?? null,
            workerId: session?.user?.email ?? null,
            userRole,
            trainingCount,
            setTrainingCount,
            logout,
            currentLang,
            changeLanguage,
            availableLanguages: languages,
            t,
            activeMachineId,
            setActiveMachineId,
            activeSite,
            setActiveSite,
            sites: constructionSites,
            authLoading: loading,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
