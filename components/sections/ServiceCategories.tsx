"use client";
import { Category } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";

interface Props {
  categories: Category[];
  selectedCategoryId?: string;
  onSelect: (catId: string) => void;
}

export default function ServiceCategories({
  categories,
  selectedCategoryId,
  onSelect,
}: Props) {
  return (
    <Card className="w-full lg:w-1/4">
      <CardHeader>
        <CardTitle className="text-lg">Select a Service</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategoryId === cat.id ? "default" : "outline"}
              className={cn(
                "justify-start h-auto py-3 px-4 transition-all duration-200",
                selectedCategoryId === cat.id 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => onSelect(cat.id)}
            >
              <div className="flex items-center gap-3">
                {cat.iconUrl && (
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                    {/* Icon would go here */}
                    <span className="text-xs">⚡</span>
                  </div>
                )}
                <span className="text-sm font-medium">{cat.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}