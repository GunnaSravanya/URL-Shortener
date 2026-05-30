function Popup({ message, onClose }) {
  // component to show simple popup message

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      {/* overlay background */}

      <div className="bg-[#111827] p-6 rounded-2xl border border-gray-700 w-[300px]">
        {/* popup box */}

        <p className="text-white mb-4">{message}</p>
        {/* message display */}

        <button
          onClick={onClose}
          className="px-4 py-2 bg-indigo-500 rounded-lg"
        >
          Close
        </button>
        {/* close button */}
      </div>
    </div>
  );
}

export default Popup;
