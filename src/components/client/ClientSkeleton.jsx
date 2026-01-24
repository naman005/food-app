import { Skeleton } from "@/components/ui/skeleton"

export const ClientSkeleton = () => {
    return (
        <div className="w-full max-w-xs h-screen flex flex-col justify-center">
            <div className="fixed top-0 left-0 w-full mx-4 my-6"><Skeleton className="h-10 w-full" /></div>
            <Skeleton className="h-[60vh] w-full" />
            <div className="fixed bottom-0 left-0 w-full mx-4 my-6"><Skeleton className="h-10 w-full" /></div>
        </div>
    )
}

export const ItemSkeleton = () => {
    return (
        <div className = "w-full max-w-xs flex flex-col justify-center overflow-hidden">
            <Skeleton className="h-[50vh] w-full" />
        </div>
    )
}