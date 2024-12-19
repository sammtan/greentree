import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface TreeRatingFormProps {
    treeId: string;
    onRatingSubmit: (rating: number) => void;
}

export function TreeRatingForm({ treeId, onRatingSubmit }: TreeRatingFormProps) {
    const [rating, setRating] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating !== null) {
            onRatingSubmit(rating);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <RadioGroup onValueChange={(value) => setRating(Number(value))}>
                {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                        <Label htmlFor={`rating-${value}`}>{value} Star{value !== 1 ? 's' : ''}</Label>
                    </div>
                ))}
            </RadioGroup>
            <Button type="submit" disabled={rating === null}>Submit Rating</Button>
        </form>
    );
}