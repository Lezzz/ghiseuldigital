import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RelatedObject } from '@wasp/entities';
import generateGptResponseNine from '@wasp/actions/generateGptResponseNine';
import useAuth from '@wasp/auth/useAuth';

type GptPayloadNine = {
  instructionsNine: string;
  commandNine: string;
};

export default function GptPage() {
  const [response, setResponse] = useState<string>('');
  
  const personalities = [
    { label: 'Personality 1', value: 'Prompt 1' },
    { label: 'Personality 2', value: 'Prompt 2' },
    { label: 'Personality 3', value: 'Prompt 3' },
    { label: 'Personality 4', value: 'Prompt 4' },
    { label: 'Personality 5', value: 'Prompt 5' },
    { label: 'Personality 6', value: 'Prompt 6' },
    { label: 'Personality 7', value: 'Prompt 7' },
    { label: 'Personality 8', value: 'Prompt 8' },
    { label: 'Personality 9', value: 'Prompt 9' },
  ];

  const [selectedPersonality, setSelectedPersonality] = useState<string>(personalities[0].value);

  const { data: user } = useAuth();

  const onSubmit = async ({  commandNine }: any) => {
    console.log('user, ', !!user);
    if (!user) {
      alert('You must be logged in to use this feature.');
      return;
    }
    try {
      const response = (await generateGptResponseNine({ instructionsNine: selectedPersonality, commandNine })) as RelatedObject;
      if (response) {
        setResponse(response.content);
      }
    } catch (e) {
      alert('Something went wrong. Please try again.');
      console.error(e);
    }
  };

  const { handleSubmit, register, reset, formState: { errors: formErrors, isSubmitting } } = useForm<{ commandNine: string }>();

  return (
    <div className='mt-10 px-6'>
      <div className='overflow-hidden bg-white ring-1 ring-gray-900/10 shadow-lg sm:rounded-lg lg:m-8'>
        <div className='m-4 py-4 sm:px-6 lg:px-8'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-6 sm:w-[90%] md:w-[60%] mx-auto border-b border-gray-900/10 px-6 pb-12'>
              <div className='col-span-full'>
                <label htmlFor='instructionsNine' className='block text-sm font-medium leading-6 text-gray-900'>
                  Alege o personalitate:
                </label>
                <div className='mt-2'>
                <div className='grid grid-cols-3 gap-4 mt-2'>
                {personalities.map((personality, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.preventDefault();
                            setSelectedPersonality(personality.value);
                        }}
                        className={`block w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6 ${
                            selectedPersonality === personality.value && 'bg-blue-500 text-white'
                        }`}
                    >
                        {personality.label}
                    </button>
                ))}
                </div>
                </div>
              </div>
              <div className='col-span-full'>
                <label htmlFor='commandNine' className='block text-sm font-medium leading-6 text-gray-900'>
                  Pune o întrebare:
                </label>
                <div className='mt-2'>
                  <textarea
                    id='commandNine'
                    placeholder='Ce acte am nevoie pentru a obține un buletin în Brașov?'
                    rows={3}
                    className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                    defaultValue={''}
                    {...register('commandNine', {
                      required: 'Completează aici',
                      minLength: {
                        value: 5,
                        message: 'Minim 5 caractere',
                      },
                    })}
                  />
                </div>
                <span className='text-sm text-red-500'>{formErrors.commandNine && formErrors.commandNine.message}</span>
              </div>
            <div className='mt-6 flex justify-end gap-x-6 sm:w-[90%] md:w-[50%] mx-auto'>
              <button
                type='submit'
                className={`${
                  isSubmitting && 'animate-puls'
                } rounded-md bg-blue-500 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              >
                {!isSubmitting ? 'Întreabă' : 'Loading...'}
              </button>
              </div>
            </div>
          </form>
          <div
            className={`${
              isSubmitting && 'animate-pulse'
            } mt-2 mx-6 flex justify-center rounded-lg border border-dashed border-gray-900/25 mt-10 sm:w-[90%] md:w-[50%] mx-auto mt-12 px-6 py-10`}
          >
            <div className='space-y-2 text-center'>
              <p className='text-sm text-gray-500'>{response ? response : 'Răspunsul se va încărca aici.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
