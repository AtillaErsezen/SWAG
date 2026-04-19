import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
    const { session, authLoading } = useAppContext();
    const location = useLocation();

    if (authLoading) return null;
    if (!session) return <Navigate to="/" state={{ from: location }} replace />;
    return children;
};

export default ProtectedRoute;
