// src/app/trees/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { TreesTable } from '@/components/TreesTable';
import { Tree } from '@/models/TreeModel';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TreesPage() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'name' | 'latinName' | 'rating'>('name');

  useEffect(() => {
    const fetchTrees = async () => {
      const response = await fetch('/api/trees');
      const data = await response.json();
      setTrees(data);
    };

    fetchTrees();
  }, []);

  const filteredTrees = trees
    .filter(tree =>
      (tree.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tree.latinName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      tree.averageRating >= ratingFilter
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'latinName':
          return a.latinName.localeCompare(b.latinName);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="p-4 space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Search Trees</label>
          <Input
            placeholder="Search by name or latin name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Minimum Rating</label>
          <Slider
            value={[ratingFilter]}
            onValueChange={([value]) => setRatingFilter(value)}
            max={5}
            step={0.5}
          />
          <div className="text-sm text-muted-foreground text-center">
            {ratingFilter} stars and above
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="latinName">Latin Name</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TreesTable trees={filteredTrees} />
    </div>
  );
}