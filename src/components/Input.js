import React from 'react';
import DocumentPlusIcon from '../public/icons/document-plus.svg';
import PaperAirplaneIcon from '../public/icons/paper-airplane.svg';

const Input = ({ prompt, setPrompt, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center p-4 rounded-b-xl">
        <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type something"
            className="flex-grow bg-secondary text-white rounded-l-lg px-4 py-2 text-sm focus:outline-none border-none h-full"
        />
        <div className='bg-secondary flex rounded-r-lg border-l-2 border-secondary-dark px-2'>
            <button type="button" className="mx-2 my-2 border rounded-lg border-opacity-50">
                <img src={DocumentPlusIcon} alt="Document Plus" className="text-gray-400 h-6 mx-4 my-2 hover:text-opacity-50" />
            </button>
            <button type="submit" className="mx-2 my-2 rounded-lg bg-primary-purple hover:bg-opacity-50">
                <img src={PaperAirplaneIcon} alt="Document Plus" className="text-gray-400 h-6 mx-4 my-2" />
            </button>
      </div>
    </form>
  );
};

function PaperclipIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function PlaneIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

export default Input;
