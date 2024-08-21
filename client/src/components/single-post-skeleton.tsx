export default function SinglePostSkeleton() {
  return (
    <div className="w-full pb-10 pt-24 px-4 md:px-0">
      <div className="flex flex-col items-center space-y-6 animate-pulse">
        <div className="w-full max-w-md rounded-lg aspect-video bg-muted" />
        <div className="space-y-4 w-full max-w-md">
          <div className="h-8 bg-muted items-start rounded-md w-3/4" />
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded-md w-full" />
            <div className="h-5 bg-muted rounded-md w-full" />
            <div className="h-5 bg-muted rounded-md w-full" />
            <div className="h-5 bg-muted rounded-md w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
