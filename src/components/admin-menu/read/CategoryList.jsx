import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import AddCategoryDialog from "../create/AddCategoryDialog"

export default function CategoryList({ categories }) {

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categories</CardTitle>
        <AddCategoryDialog />
      </CardHeader>

      <CardContent className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between border rounded-md p-3"
          >
            <span className="font-medium">{cat.name}</span>
            
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
