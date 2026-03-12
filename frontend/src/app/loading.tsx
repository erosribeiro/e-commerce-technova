export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-24 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-12 bg-muted/60 rounded-xl w-3/4 max-w-lg mb-12"></div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col gap-4 bg-card border border-border/40 rounded-3xl p-6 h-[400px]">
              <div className="w-full h-1/2 bg-muted/50 rounded-2xl mb-4"></div>
              <div className="h-6 bg-muted/50 rounded-md w-1/3"></div>
              <div className="h-8 bg-muted/50 rounded-md w-3/4 mb-2"></div>
              <div className="mt-auto flex justify-between items-end">
                <div className="h-8 bg-muted/50 rounded-md w-1/2"></div>
                <div className="w-10 h-10 bg-muted/50 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
