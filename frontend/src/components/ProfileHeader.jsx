import { CircleUserRound, LogOut, VolumeOff } from "lucide-react";
export function ProfileHeader({authUser, logout}) {
  return <div className="flex items-center justify-between bg-fuchsia-950 py-8 px-3  h-30">
          <div className="flex items-center gap-2 relative ">
            <CircleUserRound className=" bg-fuchsia-50 rounded-full" size={50} color="#f5cefe" />
            <div className="text-fuchsia-50">
              <p className="font-bold text-lg">{authUser.fullName}</p>
              <div className="w-2 h-2 bg-green-600 rounded-full absolute top-1 left-10"></div>
              <p className="text-xs">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-fuchsia-50">
            <LogOut size={20} className="cursor-pointer" onClick={logout}/>
            <VolumeOff size={20} className="cursor-pointer" />
          </div>
        </div>;
}
  