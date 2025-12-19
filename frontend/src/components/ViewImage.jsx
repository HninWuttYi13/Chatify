import { useChatStore } from "../store/useChatStore";
import { X, ArrowDown } from "lucide-react";
import { clickSound } from "./mouseClickSound";
const ViewImage = () => {
  const { viewImage, setViewImage, SoundEnabled } = useChatStore();
  const handelDownloadImage = async()=> {
    if(SoundEnabled) clickSound();
    const response = await fetch(viewImage);
    console.log(response);
    const blob = await response.blob();
    console.log(blob);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "image.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm  flex items-center justify-center sm:p-5 p-10">
      <div className="relative">
        <img
          src={viewImage}
          alt="photo"
          className="sm:max-w-2xl max-h-[600px] rounded-xl"
        />
        <div className="absolute top-2 right-3 flex items-center gap-2">
          <div
            className="bg-fuchsia-50 rounded-full cursor-pointer"
            onClick={handelDownloadImage}
          >
            
              <ArrowDown
                size={20}
                className="text-fuchsia-950 hover:text-fuchsia-700"
              />
            
          </div>
          <div
            className="bg-fuchsia-50 rounded-full cursor-pointer"
            onClick={(e) => {
                if(SoundEnabled) clickSound();
                setViewImage(null);
                e.stopPropagation();
            }}
          >
            <X size={20} className="text-fuchsia-950 hover:text-fuchsia-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewImage;
