import React from 'react';
import { useUser } from '@clerk/react';

const Protect = ({ condition, fallback = null, children }) => {
    const { isLoaded, user } = useUser();

    if (!isLoaded) return null;

    const isAuthorized = typeof condition === 'function' ? condition() : (condition !== undefined ? condition : !!user);

    if (!isAuthorized) {
        return fallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
};

export default Protect;
