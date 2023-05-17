import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { jsPDF } from 'jspdf';
import SignatureCanvas from 'react-signature-canvas';
import 'react-datepicker/dist/react-datepicker.css';
import './static/fonts/Roboto-Regular-normal.ts';
import './static/fonts/Roboto-Bold-bold.ts';
import './static/fonts/Roboto-Italic-italic.ts';



export default function PdfFillerPage() {
  const [response, setResponse] = useState<string>('');
  const sigPad = useRef<any>(null);  // Ref for SignatureCanvas
  const docRef = useRef(null);
  const { register, watch, setValue, handleSubmit, formState: { errors: formErrors, isSubmitting } } = useForm(); // combined useForm() calls here
  const selectedDate = watch('selectedDate'); // Get the current value of the
  const delivery = watch('delivery');
  const [signatureData, setSignatureData] = useState<string | null>(null);

  useEffect(() => {
    register("selectedDate"); // Register custom input
  }, [register]);

  const addSignatureIfNeeded = (yPosition) => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      const imgData = sigPad.current.toDataURL('image/png');
      const signatureHeight = 50;
      docRef.current.addImage(imgData, 'PNG', 10, yPosition, 50, signatureHeight);
      setSignatureData(imgData); // Save the signature data
  
      // Save the signature data to local storage
      localStorage.setItem('signatureData', imgData);
  
      return signatureHeight;
    }
    return 0;
  };
      
  useEffect(() => {
    if (!sigPad.current) {
      return;
    }
  
    // Check if there is signature data in local storage
    const savedSignatureData = localStorage.getItem('signatureData');
  
    if (savedSignatureData) {
      // If there is, load the data into the signature pad
      sigPad.current.fromDataURL(savedSignatureData);
    }
  }, []);
  
  // Clear both local state and local storage
  const clear = () => {
    if (sigPad.current) {
      sigPad.current.clear();
      setSignatureData(null);
      localStorage.removeItem('signatureData');
    }
  };
  
  const onSubmit = async ({ sediu, denumireInst, delivery, address, stimabile, solicitare, title, numeprenume, profesie, telefon, format }) => {
    try {
      docRef.current = new jsPDF();

      const lineHeight = 5;
      const paddingLeft = 20;
      const paddingRight = 20;
      const width = docRef.current.internal.pageSize.getWidth() - paddingLeft - paddingRight;
  
      // Define your headline text
      const headline = "Cerere Legea 544/2001";
  
      let yPosition = 20;
  
      // Set font size and style for the headline
      docRef.current.setFontSize(24); // set the font size to 24
      docRef.current.setFont('Roboto-Bold', 'bold'); // set the font style to bold
  
      // Get the page width and calculate the center x position
      const pageWidth = docRef.current.internal.pageSize.getWidth();
      const headlineWidth = docRef.current.getStringUnitWidth(headline) * docRef.current.internal.getFontSize() / docRef.current.internal.scaleFactor;
      const headlineXPosition = (pageWidth - headlineWidth) / 2;

      // Add the headline text at the calculated center position
      docRef.current.text(headline, headlineXPosition, yPosition);
  
      // Increment the yPosition for the next elements
      yPosition += lineHeight * 2; // Adjust this value according to your needs
  
      // Reset the font size and style for the rest of the document
      docRef.current.setFontSize(12); // set the font size to 12
  
      const splitSediu = docRef.current.splitTextToSize(sediu, width);
      const splitDenumireInst = docRef.current.splitTextToSize(denumireInst, width);
      const splitStimabile = docRef.current.splitTextToSize(stimabile, width);
      const splitSolicitare = docRef.current.splitTextToSize(solicitare, width);
      
      // Add the denumireInst text and then increment the yPosition
      docRef.current.text(splitDenumireInst, paddingLeft, yPosition);
      yPosition += splitDenumireInst.length * lineHeight;
  
      // Add the sediu text and then increment the yPosition
      docRef.current.text(splitSediu, paddingLeft, yPosition);
      yPosition += splitSediu.length * lineHeight;


        // Add the selected date to the PDF
        const date = new Date(selectedDate);
        const dateText = `${date.toLocaleDateString()}`;
        docRef.current.text(dateText, paddingLeft, yPosition);
        yPosition += lineHeight;

        docRef.current.setFont('Roboto-Regular', 'normal'); // set the font style to normal

        // Increment the yPosition for the next elements
      yPosition += lineHeight * 2; // Adjust this value according to your needs

      // Replace the static text with the title variable
      docRef.current.text(`${title} ${stimabile},`, paddingLeft, yPosition);
      yPosition += splitStimabile.length * lineHeight;

      // Add a new section of plain text
      const plainText = 'Prin prezenta formulez o cerere conform Legii nr. 544/2001 privind liberul acces la informațiile de interes public, cu modificările și completările ulterioare. Doresc să primesc o copie a următoarelor documente sau informații:'; // Replace this with your actual plain text
      const splitPlainText = docRef.current.splitTextToSize(plainText, width);
      docRef.current.text(splitPlainText, paddingLeft, yPosition);
      yPosition += splitPlainText.length * lineHeight;

      // Add the solicitare text and then increment the yPosition
      docRef.current.text(splitSolicitare, paddingLeft, yPosition);
      yPosition += splitSolicitare.length * lineHeight;

      // Increment the yPosition for the next elements
      yPosition += lineHeight; // Adjust this value according to your needs
  
      // Add a new section of plain text
      const plainText2 = 'Doresc ca informațiile solicitate să îmi fie furnizate:'; // Replace this with your actual plain text
      const splitPlainText2 = docRef.current.splitTextToSize(plainText2, width);
      docRef.current.text(splitPlainText2, paddingLeft, yPosition);
      yPosition += splitPlainText2.length * lineHeight;

      // Conditionally append delivery, format, and address with proper spacing
      const deliveryAndAddress = delivery === 'Prin e-mail, în format editabil' && format
        ? `${delivery} ${format}, la adresa: ${address}`
        : `${delivery}, la adresa: ${address}`;
      const splitDeliveryAndAddress = docRef.current.splitTextToSize(deliveryAndAddress, width);

      // Add the deliveryAndAddress text and then increment the yPosition
      docRef.current.text(splitDeliveryAndAddress, paddingLeft, yPosition);
      yPosition += splitDeliveryAndAddress.length * lineHeight;

      yPosition += lineHeight;


      if (sigPad.current && !sigPad.current.isEmpty()) {
        // Add the plain text related to the signature
        const plainText3 = 'Vă mulțumesc pentru solicitudine,';
        const splitPlainText3 = docRef.current.splitTextToSize(plainText3, width);
        docRef.current.text(splitPlainText3, paddingLeft, yPosition);
    
        // Add the signature
        const signatureHeight = addSignatureIfNeeded(yPosition);
        if (signatureHeight > 0) {
            yPosition += signatureHeight;
        }
        docRef.current.setFont('Roboto-Italic', 'italic');
        docRef.current.setFontSize(8);
        const plainText4 = 'semnătura petentului';
        const splitPlainText4 = docRef.current.splitTextToSize(plainText4, width);
        docRef.current.text(splitPlainText4, paddingLeft, yPosition);
        yPosition += splitPlainText4.length * lineHeight;
        docRef.current.setFont('Roboto-Regular', 'normal');
        docRef.current.setFontSize(12);
    } else {
        const plainTextNoSignature = 'Vă mulțumesc pentru solicitudine,';
        const splitPlainTextNoSignature = docRef.current.splitTextToSize(plainTextNoSignature, width);
        docRef.current.text(splitPlainTextNoSignature, paddingLeft, yPosition);
        yPosition += splitPlainTextNoSignature.length * lineHeight;
    }

      yPosition += lineHeight * 3;
      docRef.current.setFontSize(10);
      docRef.current.setFont('Roboto-Italic', 'italic');
      
      const splitNume = docRef.current.splitTextToSize(numeprenume, width);
      docRef.current.text(splitNume, paddingLeft, yPosition);
      yPosition += splitNume.length * lineHeight;
      
      const splitAdresa = docRef.current.splitTextToSize(address, width);
      docRef.current.text(splitAdresa, paddingLeft, yPosition);
      yPosition += splitAdresa.length * lineHeight;
      
      if (profesie) {
        const splitProfesie = docRef.current.splitTextToSize(profesie, width);
        docRef.current.text(splitProfesie, paddingLeft, yPosition);
        yPosition += splitProfesie.length * lineHeight;
      }
      
      if (telefon) {
        const splitTelefon = docRef.current.splitTextToSize(telefon, width);
        docRef.current.text(splitTelefon, paddingLeft, yPosition);
        yPosition += splitTelefon.length * lineHeight;
      }


  
      setResponse(docRef.current.output('datauristring'));
    } catch (e) {
      alert('Something went wrong. Please try again.');
      console.error(e);
    }
  };

  return (
    <div className='mt-10 px-6'>
      <div className='overflow-hidden bg-white ring-1 ring-gray-900/10 shadow-lg sm:rounded-lg lg:m-8'>
        <div className='m-4 py-4 sm:px-6 lg:px-8'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-6 sm:w-[90%] md:w-[60%] mx-auto border-b border-gray-900/10 px-6 pb-12'>
            <div className='col-span-full'>
                <label htmlFor='denumireInst' className='block text-sm font-medium leading-6 text-gray-900'>
                  Denumirea autorității sau instituției publice:
                </label>
                <div className='mt-2'>
                <input
                    id='denumireInst'
                    type='text'
                    placeholder='Ministerul Educației'
                    className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                    defaultValue={''}
                    {...register('denumireInst', {
                    required: 'Completează aici',
                    minLength: {
                        value: 3,
                        message: 'Minim 3 caractere',
                    },
                    })}
                />
                </div>
                <span className='text-sm text-red-500'>{formErrors.denumireInst && formErrors.denumireInst.message}</span>
              </div>
              <div className='col-span-full'>
                <label htmlFor='sediu' className='block text-sm font-medium leading-6 text-gray-900'>
                  Sediul/Adresa:
                </label>
                <div className='mt-2'>
                  <textarea
                    id='sediu'
                    placeholder='Strada General H. M. Berthelot 28-30'
                    rows={3}
                    className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                    defaultValue={''}
                    {...register('sediu', {
                      required: 'Completează aici',
                      minLength: {
                        value: 5,
                        message: 'Minim 5 caractere',
                      },
                    })}
                  />
                </div>
                <span className='text-sm text-red-500'>
                  {formErrors.sediu && formErrors.sediu.message}
                </span>
              </div>
              <div className='col-span-full'>
            <label htmlFor='selectedDate' className='block text-sm font-medium leading-6 text-gray-900'>
                Data:
            </label>
            <div className='mt-2'>
                <input
                id='selectedDate'
                type='date'
                className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                {...register('selectedDate', {
                    required: 'Alege o dată',
                })}
                />
            </div>
            <span className='text-sm text-red-500'>
                {formErrors.selectedDate && formErrors.selectedDate.message}
            </span>
            </div>
            <div className='col-span-full'>
                <label htmlFor='stimabile' className='block text-sm font-medium leading-6 text-gray-900'>
                  Cui ne adresăm?
                </label>
                <div className='w-1/2 pr-2'>
                <select
                id='title'
                className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                {...register('title', {
                    required: 'Selectează un titlu.',
                })}
                >
                <option value=''>Alege...</option>
                <option value='Stimabile domn'>Stimabile domn</option>
                <option value='Stimabilă doamnă'>Stimabilă doamnă</option>
                </select>
                <span className='text-sm text-red-500'>
                {formErrors.delivery && formErrors.delivery.message}
                </span>
                </div>
                <div className='mt-2'>
                <input
                    id='stimabile'
                    type='text'
                    placeholder='Ligia Deca, Ministrul Educației'
                    className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                    defaultValue={''}
                    {...register('stimabile', {
                    required: 'Completează aici',
                    minLength: {
                        value: 5,
                        message: 'Minim 5 caractere',
                    },
                    })}
                />
                </div>
                <span className='text-sm text-red-500'>{formErrors.denumireInst && formErrors.denumireInst.message}</span>
              </div>

              <div className='col-span-full'>
                <label htmlFor='solicitare' className='block text-sm font-medium leading-6 text-gray-900'>
                  Informațiile sau documentele solicitate (cât mai detaliat):
                </label>
                <div className='mt-2'>
                  <textarea
                    id='solicitare'
                    placeholder='Exemplu: Numărul total de școli din județul Mehedinți.'
                    rows={3}
                    className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                    defaultValue={''}
                    {...register('solicitare', {
                      required: 'Completează aici',
                      minLength: {
                        value: 5,
                        message: 'Minim 5 caractere',
                      },
                    })}
                  />
                </div>
                <span className='text-sm text-red-500'>
                  {formErrors.sediu && formErrors.sediu.message}
                </span>
              </div>

              <div className='col-span-full'>
                <label htmlFor='signature' className='block text-sm font-medium leading-6 text-gray-900'>
                Semnătura (opțional):
                </label>
                <SignatureCanvas 
                penColor='black'
                ref={sigPad}
                canvasProps={{
                  width: 250,
                  height: 250,
                  className: 'sigCanvas rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
                }}
              />
            </div>
            <div>
                <button
                type="button"
                className={`${
                    isSubmitting && 'animate-puls'
                } rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                onClick={clear}
                >
                Șterge
                </button>
                </div>
            <div className="col-span-full">
            <label htmlFor="delivery" className="block text-sm font-medium leading-6 text-gray-900">
              Doresc ca informațiile să îmi fie furnizate:
            </label>
            <select
            id="delivery"
            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            {...register("delivery", {
              required: "Alege cum dorești să îți fie livrate informațiile.",
            })}
          >
            <option value="">Alege...</option>
            <option value="Prin e-mail">Prin e-mail</option>
            <option value="Prin e-mail, în format editabil">Prin e-mail, în format editabil</option>
            <option value="În format de hârtie">În format de hârtie</option>
          </select>

            <span className="text-sm text-red-500">
              {formErrors.delivery && formErrors.delivery.message}
            </span>

            {delivery === "Prin e-mail, în format editabil" && (
            <div className="mt-2">
              <label htmlFor="format" className="block text-sm font-medium leading-6 text-gray-900">
                Alege formatul editabil:
              </label>
              <select
                id="format"
                className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                {...register("format")}
              >
                <option value="">Alege...</option>
                <option value="Word">Word</option>
                <option value="PDF">PDF</option>
              </select>
            </div>
          )}

          </div>

            <div className='col-span-full'>
                <label htmlFor='address' className='block text-sm font-medium leading-6 text-gray-900'>
                Adresa pentru livrarea informațiilor:
                </label>
                <input
                id='address'
                type='text'
                placeholder='exemplu@mail.ro'
                className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                {...register('address', {
                    required: 'Introdu adresa de livrare.',
                })}
                />
                <span className='text-sm text-red-500'>
                {formErrors.address && formErrors.address.message}
                </span>
            </div>
            <div className='col-span-full'>
                <label htmlFor='numeprenume' className='block text-sm font-medium leading-6 text-gray-900'>
                  Nume și Prenume:
                </label>
                <div className='mt-2'>
                <input
                    id='numeprenume'
                    type='text'
                    placeholder='Andrei Mihai'
                    className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                    defaultValue={''}
                    {...register('numeprenume', {
                    required: 'Completează aici',
                    minLength: {
                        value: 5,
                        message: 'Minim 5 caractere',
                    },
                    })}
                />
                </div>
                <span className='text-sm text-red-500'>{formErrors.denumireInst && formErrors.denumireInst.message}</span>
              </div>
              <div className='col-span-full'>
                <label htmlFor='profesie' className='block text-sm font-medium leading-6 text-gray-900'>
                  Profesie (opțional):
                </label>
                <div className='mt-2'>
                <input
                    id='profesie'
                    type='text'
                    placeholder='Profesor'
                    className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                    defaultValue={''}
                    {...register('profesie', {
                    minLength: {
                        value: 5,
                        message: 'Minim 5 caractere',
                    },
                    })}
                />
                </div>
                <span className='text-sm text-red-500'>{formErrors.denumireInst && formErrors.denumireInst.message}</span>
              </div>
              <div className='col-span-full'>
                <label htmlFor='telefon' className='block text-sm font-medium leading-6 text-gray-900'>
                  Telefon (opțional):
                </label>
                <div className='mt-2'>
                <input
                    id='telefon'
                    type='text'
                    placeholder='0712345678'
                    className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                    defaultValue={''}
                    {...register('telefon', {
                    minLength: {
                        value: 5,
                        message: 'Minim 5 caractere',
                    },
                    })}
                />
                </div>
                <span className='text-sm text-red-500'>{formErrors.denumireInst && formErrors.denumireInst.message}</span>
              </div>

            </div>
            <div className='mt-6 flex justify-end gap-x-6 sm:w-[90%] md:w-[50%] mx-auto'>
            <button
              type='submit'
              className={`${
                isSubmitting && 'animate-puls'
              } w-full rounded-md bg-blue-500 py-2 px-3 text-base font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              {!isSubmitting ? 'Generează cererea' : 'Loading...'}
            </button>
          </div>
          </form>
          <div
            className={`mt-2 mx-6 flex justify-center rounded-lg border border-dashed border-gray-900/25 mt-10 sm:w-[90%] md:w-[50%] mx-auto mt-12 px-6 py-10`}
        >
            <div className='space-y-2 text-center'>
            <p className='text-sm text-gray-500'>
                {response ? (
                <a href={response} download='filled_pdf.pdf'>
                    Click aici pentru a descărca cererea în format PDF.
                </a>
                ) : (
                'Răspunsul se va încărca aici.'
                )}
            </p>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}
