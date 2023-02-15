export default function Loader() {
  return (
    <div className="bg-black/30 backdrop-blur-sm fixed inset-0 z-[99] grid place-items-center">
      <div className="animate-spin duration-150 border-4 border-white border-b-black/80 h-36 w-36 rounded-full"></div>
    </div>
  );
}
