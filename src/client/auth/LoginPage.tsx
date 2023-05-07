import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '@wasp/auth/forms/Login';
import { AuthWrapper } from './authWrapper';
import useAuth from '@wasp/auth/useAuth';

export default function Login() {
  const history = useHistory();

  const { data: user } = useAuth();

  useEffect(() => {
    if (user) {
      history.push('/');
    }
  }, [user, history]);

  return (
    <AuthWrapper>
      <LoginForm />
      <br />
      <span className='text-sm font-medium text-gray-900'>
        Nu ai încă un cont?{' '}
        <Link to='/signup' className='underline'>
          Înscrie-te
        </Link>
        .
      </span>
      <br />
      <span className='text-sm font-medium text-gray-900'>
        Ai uitat parola?{' '}
        <Link to='/request-password-reset' className='underline'>
          Generază alta
        </Link>
        .
      </span>
    </AuthWrapper>
  );
}
