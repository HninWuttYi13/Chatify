import { Image, SendIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { clickSound } from "./mouseClickSound";
const sound = new Audio("/Sounds/keystroke1.mp3");
const MessageInputBox = () => {
  const textRef = useRef();
  const imageRef = useRef(null);
  const [imagePreview, setImagePreview] = useState("");
  const { sendMessage, SoundEnabled } = useChatStore();
  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = textRef.current.value;
    if (!text.trim() && !imagePreview) return;
    if (SoundEnabled) {
      sound.currentTime = 0;
      sound.play();
    }
    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });
    textRef.current.value = "";
    setImagePreview(null);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setImagePreview(reader.result);
  };
  return (
    <div className="mt-3 h-12 px-2  flex  items-center space-x-1  ">
      <form
        className="flex items-center w-full gap-2 mt-3"
        onSubmit={handleSendMessage}
      >
        <div className="flex gap-2 sm:flex-row flex-col flex-1 bg-fuchsia-50 border sm:rounded-full rounded-lg px-3 md:py-1 py-2">
          {/* IMAGE PREVIEW INSIDE THE INPUT */}
          {imagePreview && (
            <div className="relative w-12 h-12 shrink-0">
              <img
                src={imagePreview}
                alt="preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  if(SoundEnabled)clickSound();
                  setImagePreview(null)
                }}
                className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow cursor-pointer"
              >
                <X size={14} className="text-fuchsia-900" />
              </button>
            </div>
          )}

          {/* TEXT INPUT */}
          <input
            type="text"
            placeholder="Text your message"
            className="flex-1 bg-transparent outline-none text-fuchsia-950 py-1"
            ref={textRef}
          />
        </div>
        <div>
          <button type="button" onClick={() => {
            if(SoundEnabled) clickSound();
            imageRef.current.click();
          }}>
            <Image
              size={25}
              className=" text-fuchsia-950  hover:text-fuchsia-600 cursor-pointer"
            />
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageRef}
            onChange={handleImageChange}
          />
        </div>
        <div>
          <button className="p-2" type="submit">
            <SendIcon className="text-fuchsia-950" size={25} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInputBox;
