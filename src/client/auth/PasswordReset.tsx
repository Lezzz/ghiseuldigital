import { Link } from 'react-router-dom';
import { ResetPasswordForm } from '@wasp/auth/forms/ResetPassword';
import { AuthWrapper } from './authWrapper';

export function PasswordReset() {
  return (
    <AuthWrapper>
      <ResetPasswordForm />
      <br />
      <span className='text-sm font-medium text-gray-900'>
      Dacă totul este în regulă, <Link to='/login'>mergi către login.</Link>
      </span>
    </AuthWrapper>
  );
}
