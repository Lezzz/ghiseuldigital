import { Link } from 'react-router-dom';
import { VerifyEmailForm } from '@wasp/auth/forms/VerifyEmail';
import { AuthWrapper } from './authWrapper';

export function EmailVerification() {
  return (
    <AuthWrapper>
      <VerifyEmailForm />
      <br />
      <span className='text-sm font-medium text-gray-900'>
        Dacă totul este în regulă, <Link to='/login' className='underline'>mergi către login.</Link>
      </span>
    </AuthWrapper>
  );
}
