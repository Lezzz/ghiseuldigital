
import logo from './static/logo.png'
import { Disclosure } from '@headlessui/react';
import { AiOutlineBars, AiOutlineClose, AiOutlineUser } from 'react-icons/ai';
import useAuth from '@wasp/auth/useAuth';

const active = 'inline-flex items-center border-b-2 border-indigo-300 px-1 pt-1 text-sm font-medium text-gray-900';
const inactive = 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
const current = window.location.pathname;

function getPageName(path) {
  switch (path) {
    case '/':
      return 'Acasă';
    case '/pricing':
      return 'Preț';
    case '/gpt':
      return 'consilierGPT';
    case '/account':
      return 'Cont';
    case '/login':
      return 'Autentificare';
    case '/gen544':
      return 'Cerere 544';
    case '/pdf':
      return 'PDF Editor';
    default:
      return '';
  }
}

export default function NavBar() {
  const { data: user } = useAuth();
  const currentPageName = getPageName(current);

  return (
    <Disclosure as='nav' className='bg-white shadow sticky top-0 z-50 '>
      {({ open }) => (
        <>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-16'>
            <div className='flex h-16 justify-between'>
              <div className='flex'>
                <div className='flex flex-shrink-0 items-center'>
                  <a href='/'>
                    <img className='h-8 w-8' src={logo} alt='My ghd' />
                  </a>
                </div>
                <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
                  <a href='/' className={current === '/' ? active : inactive}>
                    Acasă
                  </a>
                  <a href='/pricing' className={current.includes('pricing') ? active : inactive}>
                    Preț
                  </a>
                  <a href='/gpt' className={current.includes('gpt') ? active : inactive}>
                    consilierGPT
                  </a>
                </div>
              </div>
              {/* Middle part */}
              <div className='flex items-center'>
              <div className='w-full text-center'>
                <span className='text-gray-900 font-semibold py-2'>{currentPageName}</span>
              </div>
            </div>
              <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
                <a href={!!user ? '/account' : '/login'} className={current === '/account' ? active : inactive}>
                  <AiOutlineUser className='h-6 w-6 mr-2' />
                  Cont
                </a>
              </div>
              <div className='-mr-2 flex items-center sm:hidden'>
                {/* Mobile menu */}
                <Disclosure.Button className='inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300'>
                  <span className='sr-only'>Meniu</span>
                  {open ? (
                    <AiOutlineClose className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <AiOutlineBars className='block h-6 w-6' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className='sm:hidden'>
            <div className='space-y-1 pt-2 pb-3'>
              <Disclosure.Button
                as='a'
                href='/'
                className='block border-l-4 border-indigo-300 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-500'
              >
                Acasă
              </Disclosure.Button>
              <Disclosure.Button
                as='a'
                href='/pricing'
                className='block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
              >
                Preț
              </Disclosure.Button>
              <Disclosure.Button
                as='a'
                href='/gpt'
                className='block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
              >
                consilierGPT
              </Disclosure.Button>
              {user ? (
              <Disclosure.Button
                as='a'
                href='/account'
                className='block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              >
                Cont
              </Disclosure.Button>
              )   :   (
                <Disclosure.Button
                as='a'
                href='/login'
                className='block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              >
                Cont
              </Disclosure.Button>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
