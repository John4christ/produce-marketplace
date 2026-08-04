import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (!token || !userParam) {
      toast.error('Invalid or expired OAuth response.');
      navigate('/login', { replace: true });
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));
      login(user, token);
      toast.success('Signed in successfully!');

      const role = user.roles?.[0]?.slug || 'buyer';
      if (role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else if (role === 'farmer') {
        navigate('/farmer-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch {
      toast.error('Failed to process authentication.');
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card glass-panel text-center">
          <h1 className="auth-title">Completing sign in...</h1>
          <p className="auth-subtitle">Please wait while we finish authenticating your account.</p>
        </div>
      </div>
    </div>
  );
};
