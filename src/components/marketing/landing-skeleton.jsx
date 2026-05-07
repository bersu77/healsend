export default function LandingSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-[#f9f9f9]">
      {/* Navbar */}
      <div className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4">
        <div className="h-8 w-32 rounded bg-gray-200" />
        <div className="h-9 w-24 rounded-full bg-gray-200" />
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:py-20">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <div className="mx-auto h-4 w-40 rounded bg-gray-200" />
          <div className="mx-auto h-10 w-full max-w-lg rounded bg-gray-200" />
          <div className="mx-auto h-10 w-3/4 rounded bg-gray-200" />
          <div className="mx-auto h-5 w-64 rounded bg-gray-200" />
          <div className="mx-auto h-12 w-48 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Cards row */}
      <div className="mx-auto max-w-[1200px] px-4 pb-16">
        <div className="mx-auto mb-10 h-8 w-64 rounded bg-gray-200" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-4 aspect-[4/3] rounded-xl bg-gray-200" />
              <div className="mb-2 h-5 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-100" />
              <div className="mt-1 h-4 w-2/3 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Content block */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="mx-auto max-w-lg space-y-3">
            <div className="h-6 w-48 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-5/6 rounded bg-gray-100" />
            <div className="h-4 w-2/3 rounded bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
