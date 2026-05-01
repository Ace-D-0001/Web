import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user || !isAdmin) {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
};

export default AdminRoute;
