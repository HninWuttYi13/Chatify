import React from "react";
import { useChatStore } from "../store/useChatStore";
import { clickSound } from "./mouseClickSound";

const ConfirmationDeleteMessage = () => {
  const {
    SoundEnabled,
    confirmMessageDelete,
    setConfirmMessageDelete,
    deleteChatMessageForme,
    deleteChatMessageForBothUser,

  } = useChatStore();
  return (
      <div className="bg-white rounded-md shadow-xl w-80 p-5 ">
        <h1 className="text-xl text-fuchsia-950 font-bold mb-2">
          Delete Message?
        </h1>
        <div className="flex flex-col items-end  text-md">
          <button
            className="cursor-pointer text-fuchsia-950 hover:bg-fuchsia-200 p-2 rounded-md"
            onClick={() => {
              if (SoundEnabled) clickSound();
              deleteChatMessageForme(confirmMessageDelete._id);
              setConfirmMessageDelete(null);
            }}
          >
            Delete for Me
          </button>
          <button
            className="cursor-pointer text-red-700 p-2 hover:bg-red-500 hover:text-fuchsia-50 rounded-md"
            onClick={() => {
              if (SoundEnabled) clickSound();
              deleteChatMessageForBothUser(confirmMessageDelete._id);
              setConfirmMessageDelete(null);
            }}
          >
            Delete for everyone
          </button>
          <button
            className="cursor-pointer text-fuchsia-950 hover:bg-fuchsia-200 p-2 rounded-md "
            onClick={() => {
              if (SoundEnabled) clickSound();
              setConfirmMessageDelete(null);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
  
  );
};

export default ConfirmationDeleteMessage;
