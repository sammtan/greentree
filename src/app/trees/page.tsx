'use client'

import { useEffect, useState } from 'react';
import { TreesTable } from '@/components/TreesTable';
import { Tree } from '@/models/TreeModel';

export default function TreesPage() {
  const [trees, setTrees] = useState<Tree[]>([]);

  useEffect(() => {
    const fetchTrees = async () => {
      const response = await fetch('/api/trees');
      const data = await response.json();
      setTrees(data);
    };

    fetchTrees();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Registered Trees</h1>
      <TreesTable trees={trees} />
    </div>
  );
}