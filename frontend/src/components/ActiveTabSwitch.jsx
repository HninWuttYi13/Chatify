import { useChatStore } from "../store/useChatStore";
export function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();
  return (
    <div className=" flex items-center justify-center my-2 rounded-lg bg-fuchsia-100 mx-2 shadow-xl">
      <button
        onClick={() => setActiveTab("chats")}
        className={`${
          activeTab === "chats"
            ? "bg-fuchsia-900 text-fuchsia-50"
            : "text-fuchsia-900 "
        } contactTabSwitch`}
      >
        Chats
      </button>
      <button
        onClick={() => setActiveTab("contacts")}
        className={`${
          activeTab === "contacts"
            ? "bg-fuchsia-900 text-fuchsia-50"
            : "text-fuchsia-900 "
        } contactTabSwitch`}
      >
        Contacts
      </button>
    </div>
  );
}
