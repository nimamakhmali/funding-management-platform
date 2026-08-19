'use client';
import { Search } from "lucide-react";

interface SearchBarProps {
  onBlur: () => void;
}

export const SearchBox = ({onBlur }: SearchBarProps) => {
  return (
    <div className={`relative hidden md:block transition-all duration-300 w-72 `}>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        className="block w-full h-10 pr-10 pl-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all text-sm outline-none focus:ring-2 focus:ring-purple-200 focus:bg-white"
        placeholder="جستجو کنید..."
        type="text"
        onBlur={onBlur}
      />
    </div>
  );
};