export default function InviteLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FBF7F0]">
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Outer elegant slow rotating ring */}
          <div className="absolute inset-0 rounded-full border border-black/5 border-t-black/20 animate-[spin_3s_linear_infinite]" />
          
          {/* Inner pulse */}
          <div className="absolute h-16 w-16 rounded-full bg-black/5 animate-pulse" />
          
          {/* Center dot */}
          <div className="h-2 w-2 rounded-full bg-black/40" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 font-medium">
            Preparing your experience
          </p>
          <div className="flex gap-1.5">
            <div className="h-1 w-1 rounded-full bg-black/20 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="h-1 w-1 rounded-full bg-black/20 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="h-1 w-1 rounded-full bg-black/20 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
