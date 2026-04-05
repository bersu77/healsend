export default function GlobalLoading() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[110] bg-white/12"
    >
      <div className="fixed inset-x-0 top-0 h-[3px] overflow-hidden bg-transparent">
        <div className="h-full w-1/3 animate-[globalRouteLoading_1.1s_ease-in-out_infinite] bg-[linear-gradient(90deg,#5b3cdd_0%,#7b75f0_55%,#9fe8d7_100%)] shadow-[0_0_24px_rgba(91,60,221,0.42)]" />
      </div>
    </div>
  );
}
