import { LiaSortSolid } from "react-icons/lia";
import { CiSearch } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="flex flex-row justify-between items-center bg-[#FAFBFC] border-b border-gray-200 p-2">
      <div className="rounded-lg flex flex-row gap-x-2 p-2 items-center justify-center">
        <LiaSortSolid className="text-[#0F1923]" size={16} />
        <h2 className="text-lg font-semibold text-[#0F1923]">sortThrough</h2>
      </div>

      <div className="flex flex-row gap-x-5 items-center">
        <div className="flex flex-row items-center bg-gray-300 gap-x-2 rounded-lg px-4 py-2 w-full max-w-md">
          <CiSearch />
          <input className="bg-transparent outline-none w-full text-sm" placeholder="Search for anything" />
        </div>

        <div className="bg-[#0F1923] rounded-full p-3 flex items-center justify-center">
          <IoIosNotificationsOutline className="text-[#CBDDE9]" size={18} />
        </div>

        <div className="rounded-full overflow-hidden w-10 h-10 shrink-0">
          <Image
            src="/profile.svg"
            alt="profile"
            width={40}
            height={40}
            className="rounded-full object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}