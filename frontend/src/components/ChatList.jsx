import React from "react";
import { CircleUserRound } from "lucide-react";
export function ChatList({}) {
  return <div className="flex-1 overflow-y-auto px-3 space-y-2">
          <div className="flex gap-2 items-center p-3 bg-fuchsia-300 rounded-sm cursor-pointer hover:bg-fuchsia-100">
            <div className="relative">
              <CircleUserRound className=" bg-fuchsia-50 rounded-full" size={50} color="#f5cefe" />
              <div className="w-2 h-2 bg-green-600 rounded-full absolute top-1 left-10"></div>
            </div>
            <p className="text-fuchsia-950 text-lg font-bold ">John Doe</p>
          </div>
        </div>;
}
  