import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useActiveNav = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') {
      return activePath === '/';
    }
    return activePath.startsWith(path);
  };

  return { isActive };
};
