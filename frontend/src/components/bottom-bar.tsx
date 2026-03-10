export function BottomBar() {
  return (
    <footer className="h-9 border-t border-[#e1dfdd] bg-white flex items-center px-3 text-xs text-[#323130]">
      <div className="flex items-center gap-2">
        <div className="h-5 w-6 border border-[#a19f9d] rounded-sm" />
        <div className="h-5 w-6 border border-[#a19f9d] rounded-sm" />
      </div>
      <div className="ml-4 flex items-center gap-1">
        <button className="px-3 py-[3px] rounded-sm bg-[#107c10] text-white text-xs">
          Page 1
        </button>
        <button className="ml-1 h-5 w-5 rounded-full border border-[#107c10] text-[#107c10] flex items-center justify-center">
          +
        </button>
      </div>
      <div className="ml-auto text-[#605e5c]">Page 1 of 1</div>
    </footer>
  );
}
