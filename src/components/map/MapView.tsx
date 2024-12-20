'use client'

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Tree } from '@/models/TreeModel';
import { TreePhotoCarousel } from '@/components/TreePhotoCarousel';
import { TreeReportForm } from '@/components/TreeReportForm';
import { TreeRatingForm } from '@/components/TreeRatingForm';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { useCallback } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Star, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AddTreeDialog } from '../admin/AddTreeDialog';

interface MapViewProps {
  center: [number, number];
  zoom: number;
}

export function MapView({ center, zoom }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const { theme } = useTheme();
  const [username, setUsername] = useState<string>(''); // Add this

  const [isAddTreeDialogOpen, setIsAddTreeDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setIsAdmin(data.role === 'admin');
      } catch (error) {
        console.error('Admin check error:', error);
      }
    };

    checkAdmin();
  }, []);

  // Fetch username when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          const data = await response.json();
          if (data.username) {
            setUsername(data.username);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuth();
  }, []);

  const handleRatingSubmit = async (treeId: string, rating: number) => {
    if (!username) {
      alert('Please sign in to rate trees');
      return;
    }
    try {
      const response = await fetch(`/api/trees/${treeId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username, // Add this
          rating
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit rating');
      }
      alert('Rating submitted successfully');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit rating');
    }
  };

  const handleReportSubmit = async (treeId: string, description: string) => {
    if (!username) {
      alert('Please sign in to report trees');
      return;
    }
    try {
      const response = await fetch(`/api/trees/${treeId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username, // Add this
          description
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }
      alert('Report submitted successfully');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit report');
    }
  };

  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const response = await fetch('/api/trees');
        const data = await response.json();
        console.log('Fetched trees:', data);
        setTrees(data);
      } catch (error) {
        console.error('Error fetching trees:', error);
      }
    };

    fetchTrees();
  }, []);

  const addTreeMarkers = useCallback(() => {
    if (!map.current) return;

    trees.forEach((tree) => {
      const el = document.createElement('div');
      el.className = 'tree-marker';
      el.innerHTML = '🌳';

      const marker = new maplibregl.Marker(el)
        .setLngLat(tree.location.coordinates)
        .addTo(map.current);

      marker.getElement().addEventListener('click', (e) => {
        e.preventDefault();
        setSelectedTree(tree);
        setIsDialogOpen(true);
      });
    });
  }, [trees]);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: center,
      zoom: zoom
    });

    map.current.addControl(new maplibregl.NavigationControl());

    map.current.on('load', () => {
      console.log('Map loaded');
      if (trees.length > 0) {
        addTreeMarkers();
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [center, zoom, trees, addTreeMarkers]);

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded() && trees.length > 0) {
      console.log('Adding markers for trees:', trees);
      addTreeMarkers();
    }
  }, [trees, addTreeMarkers]);

  const flyToFirstTree = () => {
    if (map.current && trees.length > 0) {
      map.current.flyTo({
        center: trees[0].location.coordinates,
        zoom: 15
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" style={{ minHeight: '400px' }} />
      <div className="absolute top-4 left-4 space-y-2">
        {trees.length > 0 && (
          <Button onClick={flyToFirstTree}>
            Fly to First Tree
          </Button>
        )}
        {isAdmin && (
          <Button onClick={() => setIsAddTreeDialogOpen(true)}>
            Add New Tree
          </Button>
        )}
      </div>

      {isAdmin && (
        <AddTreeDialog
          isOpen={isAddTreeDialogOpen}
          onClose={() => setIsAddTreeDialogOpen(false)}
          onSubmit={async (treeData) => {
            try {
              const response = await fetch('/api/trees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(treeData),
              });
              if (!response.ok) throw new Error('Failed to add tree');
              // Refresh trees
              const updatedTrees = await fetch('/api/trees').then(res => res.json());
              setTrees(updatedTrees);
              setIsAddTreeDialogOpen(false);
            } catch (error) {
              console.error('Error adding tree:', error);
              alert('Failed to add tree');
            }
          }}
        />
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setSelectedTree(null);
          }
        }}
      >
        {selectedTree && (
          <DialogContent className="sm:max-w-[800px] lg:max-w-[1200px] font-inter"> {/* Perlebar dialog */}
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedTree.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6">
              {/* Kolom Kiri - Informasi Utama */}
              <div className="space-y-4">
                <Link
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(selectedTree.latinName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="text-lg italic cursor-pointer hover:underline">
                    {selectedTree.latinName}
                  </p>
                </Link>
                <TreePhotoCarousel photos={selectedTree.photos} />
                <p className="text-lg">Rating: {selectedTree.averageRating.toFixed(1)} ⭐</p>
                <p className="text-base">{selectedTree.description || 'No description available.'}</p>
                <TreeRatingForm
                  treeId={selectedTree._id!.toString()}
                  username={username} // Add this
                  onRatingSubmit={(rating) => {
                    handleRatingSubmit(selectedTree._id!.toString(), rating);
                    setIsDialogOpen(false);
                  }}
                />
                <TreeReportForm
                  treeId={selectedTree._id!.toString()}
                  username={username} // Add this
                  onReportSubmit={(report) => {
                    handleReportSubmit(selectedTree._id!.toString(), report);
                    setIsDialogOpen(false);
                  }}
                />
              </div>

              {/* Kolom Kanan - All Ratings & Reports */}
              <div className="space-y-6 border-l pl-6">
                {/* All Ratings Section */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2 sticky top-0 bg-background">
                    <Star className="w-5 h-5" />
                    All Ratings
                  </h3>
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 scrollbar-track-transparent">
                    {selectedTree.ratings && selectedTree.ratings.length > 0 ? (
                      [...selectedTree.ratings]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((rating, index) => (
                          <Card key={index} className="p-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback>{rating.username[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{rating.username}</span>
                              </div>
                              <span className="text-yellow-500 flex items-center gap-1">
                                {rating.rating} <Star className="w-4 h-4 fill-current" />
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(rating.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </Card>
                        ))
                    ) : (
                      <Card className="p-4 text-center text-muted-foreground">
                        No ratings yet
                      </Card>
                    )}
                  </div>
                </div>

                {/* All Reports Section */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2 sticky top-0 bg-background">
                    <AlertCircle className="w-5 h-5" />
                    All Reports
                  </h3>
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 scrollbar-track-transparent">
                    {selectedTree.reports && selectedTree.reports.length > 0 ? (
                      [...selectedTree.reports]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((report, index) => (
                          <Card key={index} className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback>{report.username[0].toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{report.username}</span>
                            </div>
                            <p className="text-sm border-l-2 border-primary/20 pl-3">
                              {report.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(report.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </Card>
                        ))
                    ) : (
                      <Card className="p-4 text-center text-muted-foreground">
                        No reports yet
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedTree(null);
                }}
              >
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}