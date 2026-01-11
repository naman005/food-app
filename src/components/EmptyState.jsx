import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
export function EmptyState({ className, onSetup, onCancel }) {
    return (
    <Empty className={className}>
    <EmptyHeader>
    <EmptyTitle>No menu found</EmptyTitle>
    <EmptyDescription>Looks like you have not set up your menu yet <br />
          Let us do it once and you can edit it anytime later.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
    <div className="flex space-x-4">
    <Button onClick={onSetup}>Set Up</Button>
    <Button onClick={onCancel} variant="outline">I'll do it later</Button>
    </div>
    <EmptyDescription>
        Need help? <a href="mailto:namanchaturvedi@hotmail.com?subject=Menu%20Setup%20Help">Contact support</a>
    </EmptyDescription>
    </EmptyContent>
</Empty>
    )
}