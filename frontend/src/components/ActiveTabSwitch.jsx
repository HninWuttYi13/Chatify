import React from "react";
export function ActiveTabSwitch({}) {
  return (
    <div className=" flex items-center justify-center my-2 rounded-lg bg-fuchsia-100 mx-2 shadow-xl">
      <button className="contactTabSwitch">Chats</button>
      <button className="contactTabSwitch">Contacts</button>
    </div>
  );
}
  