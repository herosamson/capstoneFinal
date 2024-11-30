import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const UseInactivityTimeout = ({ timeout = 1800000 }) => {
  const navigate = useNavigate();
  const timerId = useRef(null);

  const resetTimeout = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    timerId.current = setTimeout(() => {
      alert('You have been logged out due to inactivity.');
      localStorage.clear();
      navigate('/login');
    }, timeout);
  }, [navigate, timeout]);

  useEffect(() => {
    const handleActivity = () => {
      resetTimeout();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    resetTimeout();

    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }

      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [resetTimeout]);

  return null;
};

export default UseInactivityTimeout;
