import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { jsPDF } from 'jspdf';
import SignaturePad from 'react-signature-canvas';
import 'react-datepicker/dist/react-datepicker.css';


export default function PdfFillerPage() {
    const [response, setResponse] = useState<string>('');
    const [sigPad, setSigPad] = useState<any | null>(null);
    const docRef = useRef(null);
    const { register, watch, setValue, handleSubmit, formState: { errors: formErrors, isSubmitting } } = useForm(); // combined useForm() calls here
    const selectedDate = watch('selectedDate'); // Get the current value of the
  
    useEffect(() => {
      register('selectedDate'); // Register custom input
      }, [register]);

  const clear = () => {
    if (sigPad) {
      sigPad.clear();
    }
  }

  const updateSignature = (yPosition) => {
    if (sigPad && docRef.current) {
      const imgData = sigPad.toDataURL('image/png');
      const signatureHeight = 50;
      docRef.current.addImage(imgData, 'PNG', 10, yPosition, 50, signatureHeight);
      return signatureHeight;
    }
    return 0;
  };

  const onSubmit = async ({ sediu, denumireInst, delivery, address, stimabile, solicitare, title }) => {
    try {
      docRef.current = new jsPDF();
  
      const lineHeight = 5;
      const paddingLeft = 20;
      const paddingRight = 20;
      const width = docRef.current.internal.pageSize.getWidth() - paddingLeft - paddingRight;
  
      // Define your headline text
      const headline = "Cerere legea 544/2001";
  
      let yPosition = 20;
  
      // Set font size and style for the headline
      docRef.current.setFontSize(24); // set the font size to 24
      docRef.current.setFont('Times-Roman', 'bold'); // set the font style to bold
  
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
        const dateText = `Data: ${date.toLocaleDateString()}`;
        docRef.current.text(dateText, paddingLeft, yPosition);
        yPosition += lineHeight;

        docRef.current.setFont('Times-Roman', 'normal'); // set the font style to normal

        // Increment the yPosition for the next elements
      yPosition += lineHeight * 2; // Adjust this value according to your needs

      // Replace the static text with the title variable
      docRef.current.text(`${title} ${stimabile}`, paddingLeft, yPosition);
      yPosition += splitStimabile.length * lineHeight;

      // Add a new section of plain text
      const plainText = 'Prin prezenta formulez o cerere conform Legii nr. 544/2001 privind liberul acces la informațiile de interes public, cu modificările și completările ulterioare. Doresc să primesc o copie de pe următoarele documente (petentul este rugat să enumere cât mai concret documentele sau informațiile solicitate):'; // Replace this with your actual plain text
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

      // Append delivery and address with proper spacing
      const deliveryAndAddress = `${delivery}, la adresa: ${address}`;
      const splitDeliveryAndAddress = docRef.current.splitTextToSize(deliveryAndAddress, width);
  
      // Add the deliveryAndAddress text and then increment the yPosition
      docRef.current.text(splitDeliveryAndAddress, paddingLeft, yPosition);
      yPosition += splitDeliveryAndAddress.length * lineHeight;


        // Add a new section of plain text
        const plainText3 = 'Vă mulțumesc pentru solicitudine,'; // Replace this with your actual plain text
        const splitPlainText3 = docRef.current.splitTextToSize(plainText3, width);
        docRef.current.text(splitPlainText3, paddingLeft, yPosition);
        yPosition += splitPlainText3.length * lineHeight;
      // Call the updateSignature function and increment yPosition
      const signatureHeight = updateSignature(yPosition);
      yPosition += signatureHeight + lineHeight;

        // Add a new section of plain text
        const plainText4 = 'semnătura petentului'; // Replace this with your actual plain text
        const splitPlainText4 = docRef.current.splitTextToSize(plainText4, width);
        docRef.current.text(splitPlainText4, paddingLeft, yPosition);
        yPosition += splitPlainText4.length * lineHeight;


  
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
                  Denumirea instituției:
                </label>
                <div className='mt-2'>
                <input
                    id='denumireInst'
                    type='text'
                    placeholder='Ce acte am nevoie pentru a obține un buletin în Brașov?'
                    className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                    defaultValue={''}
                    {...register('denumireInst', {
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
                <label htmlFor='sediu' className='block text-sm font-medium leading-6 text-gray-900'>
                  Sediul/Adresa:
                </label>
                <div className='mt-2'>
                  <textarea
                    id='sediu'
                    placeholder='Vreau să te comporți ca un funcționar public și să mă îndrumi.'
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
                Select a Date:
            </label>
            <div className='mt-2'>
                <input
                id='selectedDate'
                type='date'
                className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                {...register('selectedDate', {
                    required: 'Select a date',
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
                <label htmlFor='title' className='block text-sm font-medium leading-6 text-gray-900'>
                Titlu:
                </label>
                <select
                id='title'
                className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                {...register('title', {
                    required: 'Select a title method',
                })}
                >
                <option value=''>Select...</option>
                <option value='Stimabile domn'>Domnul</option>
                <option value='Stimabile doamna'>Doamna</option>
                </select>
                <span className='text-sm text-red-500'>
                {formErrors.delivery && formErrors.delivery.message}
                </span>
                </div>
                <div className='mt-2'>
                <input
                    id='stimabile'
                    type='text'
                    placeholder='Ce acte am nevoie pentru a obține un buletin în Brașov?'
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
                  Datele solicitate:
                </label>
                <div className='mt-2'>
                  <textarea
                    id='solicitare'
                    placeholder='Vreau să te comporți ca un funcționar public și să mă îndrumi.'
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
                Semnătura
                </label>
                <SignaturePad 
                penColor='black'
                backgroundColor='rgba(0,0,0,0)'
                canvasProps={{
                    className: 'sigCanvas block w-full rounded-md border-0 text-gray-900 items-center shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6', 
                    style: {width: '290px', height: '290px'}
                }} 
                ref={(ref) => { setSigPad(ref) }} 
                onEnd={updateSignature}
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
                Clear
                </button>
                </div>
            <div className='flex justify-between items-center'>
            <div className='w-1/2 pr-2'>
                <label htmlFor='delivery' className='block text-sm font-medium leading-6 text-gray-900'>
                Delivery Method:
                </label>
                <select
                id='delivery'
                className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                {...register('delivery', {
                    required: 'Select a delivery method',
                })}
                >
                <option value=''>Select...</option>
                <option value='Prin e-mail'>Prin e-mail</option>
                <option value='Prin e-mail, în format editabil'>Prin e-mail, în format editabil</option>
                <option value='În format fizic'>În format fizic</option>
                </select>
                <span className='text-sm text-red-500'>
                {formErrors.delivery && formErrors.delivery.message}
                </span>
            </div>

            <div className='w-1/2 pl-2'>
                <label htmlFor='address' className='block text-sm font-medium leading-6 text-gray-900'>
                Delivery Address:
                </label>
                <input
                id='address'
                type='text'
                placeholder='Enter delivery address'
                className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                {...register('address', {
                    required: 'Enter delivery address',
                })}
                />
                <span className='text-sm text-red-500'>
                {formErrors.address && formErrors.address.message}
                </span>
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
            className={`mt-2 mx-6 flex justify-center rounded-lg border border-dashed border-gray-900/25 mt-10 sm:w-[90%] md:w-[50%] mx-auto mt-12 px-6 py-10`}
        >
            <div className='space-y-2 text-center'>
            <p className='text-sm text-gray-500'>
                {response ? (
                <a href={response} download='filled_pdf.pdf'>
                    Descarcă PDF-ul
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
