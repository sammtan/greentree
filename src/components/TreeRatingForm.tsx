import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface TreeRatingFormProps {
  treeId: string;
  username: string; // Add this
  onRatingSubmit: (rating: number) => void;
}

export function TreeRatingForm({ treeId, username, onRatingSubmit }: TreeRatingFormProps) {
  const [rating, setRating] = useState<number | null>(null);

  if (!username) {
    return (
      <div className="text-center text-muted-foreground">
        Please sign in to rate this tree
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating !== null) {
      onRatingSubmit(rating);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            type="button"
            variant={rating === value ? "default" : "outline"}
            size="sm"
            onClick={() => setRating(value)}
          >
            <Star className={rating !== null && rating >= value ? "fill-yellow-400" : "fill-gray-300"} />
          </Button>
        ))}
      </div>
      <Button type="submit" className="w-full" disabled={rating === null}>Submit Rating</Button>
    </form>
  );
}
