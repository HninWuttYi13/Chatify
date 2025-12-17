import { useChatStore } from "../store/useChatStore";
import { clickSound } from "./mouseClickSound";
const Confirmation = () => {
    const { confirmDelete, setConfirmDelete, deleteChatMessageForMe, SoundEnabled } =
      useChatStore();
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm  flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-80 p-5">
        <h3 className="text-lg font-bold text-fuchsia-900 mb-3">
          Delete Chat?
        </h3>

        <p className="text-md text-fuchsia-950 mb-5">
          Are you sure you want to delete all chat history with{" "}
          <span className="font-semibold">{confirmDelete.fullName}</span>? This
          action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer"
            onClick={() => {
                if(SoundEnabled) clickSound();
                setConfirmDelete(null);
            }
            }
          >
            No
          </button>

          <button
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            onClick={() => {
                if(SoundEnabled) clickSound();
              deleteChatMessageForMe(confirmDelete._id);
              setConfirmDelete(null);
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirmation