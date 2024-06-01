import React, { useState } from 'react';
import { ReactComponent as DocumentPlusIcon } from '../public/icons/document-plus.svg';
import { ReactComponent as PaperAirplaneIcon } from '../public/icons/paper-airplane.svg';
import { FaRegFilePdf } from "react-icons/fa";

const Input = ({ prompt, setPrompt, handleSubmit }) => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    const newPreviewUrls = selectedFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreviewUrls((prevUrls) => [...prevUrls, reader.result]);
      };
    });
  };

  return (
    <div className='w-full flex flex-wrap flex-row'>
        <div className='w-full flex flex-row flex-wrap'>
            {files.map((file, index) => (
                <div key={index} className='w-auto flex justify-items-start pl-4 pt-2'>
                    {file.type === 'application/pdf' ? (
                        <div className='w-10 h-auto'>  
                            <FaRegFilePdf className='w-auto h-12' />
                        </div>
                    ) : (
                        <img src={previewUrls[index]} alt="Preview" className="w-auto h-12 rounded-md" />
                    )}
                </div>
            ))}
        </div>
        <form onSubmit={(e) => handleSubmit(e, files)} className="w-full flex items-center p-4 rounded-b-xl flex-wrap">
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type something"
                className="flex-grow bg-secondary text-white rounded-l-lg px-4 py-2 text-sm focus:outline-none border-none h-full"
            />
            <div className='bg-secondary flex rounded-r-lg border-l-2 border-secondary-dark px-2'>
                <label htmlFor="file-input" className="mx-2 my-2 border rounded-lg hover:border-primary-purple border-opacity-50 cursor-pointer">
                <DocumentPlusIcon className='text-gray-400 h-6 mx-4 my-2'/>
                <input id="file-input" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} multiple style={{ display: 'none' }} />
                </label>
                <button type="submit" className="mx-2 my-2 rounded-lg bg-primary-purple hover:bg-opacity-50">
                <PaperAirplaneIcon className='text-gray-400 h-6 mx-4 my-2'/>
                </button>
            </div>
        </form>
    </div>

  );
};

export default Input;
