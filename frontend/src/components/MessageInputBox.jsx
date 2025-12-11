import { FileInput, Image, SendIcon } from "lucide-react";
import { useRef } from "react";

const MessageInputBox = () => {
  const imageRef= useRef(null);
  return (
    <div className="h-14 px-3 flex items-center space-x-4 border-t border-t-fuchsia-900">
      <form className="flex items-center w-full gap-2 mt-3">
        <input
          type="text"
          placeholder="Text your message"
          className="flex-1 px-5 py-3 border bg-fuchsia-50 outline-0 text-fuchsia-950 focus:border-fuchsia-900 focus:border-2 rounded-full text-md"
        />
        <div>
          <button type="button" onClick={()=>imageRef.current.click()}>
            <Image size={32} className="text-fuchsia-950 hover:text-fuchsia-600 cursor-pointer"/>
          </button>
          <input type="file" accept="image/*" className="hidden" ref={imageRef}/>
        </div>
        <div>
          <button className="p-2" type="submit">
            <SendIcon className="text-fuchsia-950" size={32} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInputBox;
