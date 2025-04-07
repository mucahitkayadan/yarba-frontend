import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login page immediately
    navigate('/login', { replace: true });
  }, [navigate]);
  
  // This component won't render as it redirects immediately
  return null;
};

export default RegisterPage; 