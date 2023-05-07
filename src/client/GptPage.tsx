import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RelatedObject } from '@wasp/entities';
import generateGptResponse from '@wasp/actions/generateGptResponse';
import useAuth from '@wasp/auth/useAuth';

type GptPayload = {
  instructions: string;
  command: string;
  temperature: number;
};

export default function GptPage() {
  const [temperature, setTemperature] = useState<number>(1);
  const [response, setResponse] = useState<string>('');

  const { data: user } = useAuth();

  const onSubmit = async ({ instructions, command, temperature }: any) => {
    console.log('user, ', !!user);
    if (!user) {
      alert('You must be logged in to use this feature.');
      return;
    }
    try {
      const response = (await generateGptResponse({ instructions, command, temperature })) as RelatedObject;
      if (response) {
        setResponse(response.content);
      }
    } catch (e) {
      alert('Something went wrong. Please try again.');
      console.error(e);
    }
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors: formErrors, isSubmitting },
  } = useForm();

  return (
    <div className='mt-10 px-6'>
      <div className='overflow-hidden bg-white ring-1 ring-gray-900/10 shadow-lg sm:rounded-lg lg:m-8'>
        <div className='m-4 py-4 sm:px-6 lg:px-8'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-6 sm:w-[90%] md:w-[60%] mx-auto border-b border-gray-900/10 px-6 pb-12'>
              <div className='col-span-full'>
                <label htmlFor='instructions' className='block text-sm font-medium leading-6 text-gray-900'>
                  Instrucțiuni -- Cum ai vrea să se comporte?
                </label>
                <div className='mt-2'>
                  <textarea
                    id='instructions'
                    placeholder='Vreau să te comporți ca un funcționar public și să mă îndrumi.'
                    rows={3}
                    className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                    defaultValue={''}
                    {...register('instructions', {
                      required: 'Completează aici',
                      minLength: {
                        value: 5,
                        message: 'Minim 5 caractere',
                      },
                    })}
                  />
                </div>
                <span className='text-sm text-red-500'>
                  {formErrors.instructions && formErrors.instructions.message}
                </span>
              </div>
              <div className='col-span-full'>
                <label htmlFor='command' className='block text-sm font-medium leading-6 text-gray-900'>
                  Comandă -- Ce ai vrea să facă?
                </label>
                <div className='mt-2'>
                  <textarea
                    id='command'
                    placeholder='Ce acte am nevoie pentru a obține un buletin în Brașov?'
                    rows={3}
                    className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                    defaultValue={''}
                    {...register('command', {
                      required: 'Completează aici',
                      minLength: {
                        value: 5,
                        message: 'Minim 5 caractere',
                      },
                    })}
                  />
                </div>
                <span className='text-sm text-red-500'>{formErrors.command && formErrors.command.message}</span>
              </div>

              <div className='h-10 '>
                <label htmlFor='temperature' className='w-full text-gray-700 text-sm font-semibold'>
                  Randomness
                </label>
                <div className='w-32 mt-2'>
                  <div className='flex flex-row h-10 w-full rounded-lg relative rounded-md border-0 ring-1 ring-inset ring-gray-300 bg-transparent mt-1'>
                    <input
                      type='number'
                      className='outline-none focus:outline-none border-0 rounded-md ring-1 ring-inset ring-gray-300 text-center w-full font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none'
                      value={temperature}
                      min='0'
                      max='2'
                      step='0.1'
                      {...register('temperature', {
                        onChange: (e) => {
                          console.log(e.target.value);
                          setTemperature(Number(e.target.value));
                        },
                        required: 'This is required',
                      })}
                    ></input>
                  </div>
                </div>
              </div>
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
