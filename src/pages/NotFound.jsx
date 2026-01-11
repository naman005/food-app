import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
export default function NotFound() {
    return (
    <Empty className="flex items-center justify-center">
    <EmptyHeader>
    <EmptyTitle>404 - Page Not Found</EmptyTitle>
    <EmptyDescription> Oops! The page you're looking for doesn't exist or has been moved.</EmptyDescription>
    </EmptyHeader>
    </Empty>
    )
}