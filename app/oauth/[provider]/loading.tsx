import { Skeleton } from "@/components/ui/skeleton"

export default function OAuthLoading() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-10 px-4 md:px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    </div>
  )
}
