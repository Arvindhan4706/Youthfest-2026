export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#030014] text-white p-4 sm:p-8 flex items-center justify-center">
      <div className="container-responsive w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-pulse">
        
        {/* Left Column - Profile (Col span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-white/5 bg-[#0a0520]/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden h-[450px]">
            {/* Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800/20 to-transparent pointer-events-none" />
            
            {/* Avatar Skeleton */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-gray-700 bg-gray-800/50 mb-6 mx-auto" />
            
            {/* Text Skeleton */}
            <div className="space-y-4 text-center flex flex-col items-center">
              <div className="h-8 w-48 bg-gray-800/50 rounded-full" />
              <div className="h-4 w-32 bg-gray-800/50 rounded-full" />
              <div className="h-4 w-24 bg-gray-800/50 rounded-full" />
            </div>

            {/* Badges Skeleton */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="h-16 rounded-2xl bg-gray-800/50" />
              <div className="h-16 rounded-2xl bg-gray-800/50" />
            </div>
          </div>
        </div>

        {/* Right Column - Tickets & Inbox (Col span 8) */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          
          {/* Top Bar Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#0a0520]/50 border border-white/5 rounded-2xl p-4">
            <div className="flex gap-2">
              <div className="w-24 h-10 bg-gray-800/50 rounded-xl" />
              <div className="w-24 h-10 bg-gray-800/50 rounded-xl" />
            </div>
            <div className="w-32 h-10 bg-gray-800/50 rounded-xl" />
          </div>

          {/* Ticket Pass Skeleton */}
          <div className="rounded-3xl border border-white/5 bg-[#0a0520]/50 overflow-hidden shadow-2xl h-[300px] flex">
            {/* Ticket Left */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between border-r border-dashed border-gray-700">
              <div className="space-y-4">
                <div className="h-8 w-1/3 bg-gray-800/50 rounded-full" />
                <div className="h-4 w-1/2 bg-gray-800/50 rounded-full" />
              </div>
              <div className="space-y-3">
                <div className="h-6 w-1/4 bg-gray-800/50 rounded-full" />
                <div className="h-4 w-1/3 bg-gray-800/50 rounded-full" />
              </div>
            </div>
            {/* Ticket Right */}
            <div className="w-32 sm:w-48 bg-gray-900/50 flex flex-col items-center justify-center p-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-800/50 rounded-xl" />
            </div>
          </div>

          {/* Inbox Skeleton */}
          <div className="rounded-3xl border border-white/5 bg-[#0a0520]/50 p-6 sm:p-8 shadow-2xl">
            <div className="h-6 w-32 bg-gray-800/50 rounded-full mb-6" />
            
            <div className="space-y-4">
              <div className="h-20 w-full bg-gray-800/50 rounded-2xl" />
              <div className="h-20 w-full bg-gray-800/50 rounded-2xl" />
              <div className="h-20 w-full bg-gray-800/50 rounded-2xl" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

