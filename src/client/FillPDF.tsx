import { useState } from 'react';
import { useForm } from 'react-hook-form';
import React from 'react';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const PdfComponent: React.FC = () => {

  const [inputValue, setInputValue] = useState<string>('');
  const {
    handleSubmit,
    register,
    formState: { errors: formErrors, isSubmitting },
  } = useForm();

  const fillPdf = async () => {
    const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
    const response = await fetch(url)
    const existingPdfBytes = await response.arrayBuffer()

    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()
    firstPage.drawText(inputValue, {
      x: 5,
      y: height / 2 + 300,
      size: 50,
      font: helveticaFont,
      color: rgb(0.95, 0.1, 0.1),
      rotate: degrees(-45),
    })

    const pdfBytes = await pdfDoc.save()

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'modified.pdf';
    link.click();
  }

  return (
    <div className='mt-10 px-6'>
      <div className='overflow-hidden bg-white ring-1 ring-gray-900/10 shadow-lg sm:rounded-lg lg:m-8'>
        <div className='m-4 py-4 sm:px-6 lg:px-8'>
          <form onSubmit={handleSubmit(fillPdf)}>
            <div className='space-y-6 sm:w-[90%] md:w-[60%] mx-auto border-b border-gray-900/10 px-6 pb-12'>
              <div className='col-span-full'>
                <label htmlFor='input' className='block text-sm font-medium leading-6 text-gray-900'>
                  Enter text to add to PDF
                </label>
                <div className='mt-2'>
                  <textarea
                    id='input'
                    rows={3}
                    className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6'
                    defaultValue={''}
                    {...register('input', {
                      required: 'This field is required',
                    })}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
                <span className='text-sm text-red-500'>
                  {formErrors.input && formErrors.input.message}
                </span>
              </div>
            </div>
            <div className='mt-6 flex justify-end gap-x-6 sm:w-[90%] md:w-[50%] mx-auto'>
              <button
                type='submit'
                className={`${
                  isSubmitting && 'animate-puls'
                } rounded-md bg-blue-500 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              >
                {!isSubmitting ? 'Modify and Download PDF' : 'Loading...'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
}

export default PdfComponent;