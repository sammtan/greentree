// src/components/map/MapView.tsx

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
import { tree } from 'next/dist/build/templates/app-page';

interface MapViewProps {
    center: [number, number];
    zoom: number;
}

export function MapView({ center, zoom }: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [trees, setTrees] = useState<Tree[]>([]);

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

    const handleReportSubmit = async (treeId: string, report: string) => {
        try {
            const response = await fetch(`/api/trees/${treeId}/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: report }),
            });
            if (response.ok) {
                alert('Report submitted successfully');
            } else {
                alert('Failed to submit report');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('An error occurred while submitting the report');
        }
    };

    const handleRatingSubmit = async (treeId: string, rating: number) => {
        try {
            const response = await fetch(`/api/trees/${treeId}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating }),
            });
            if (response.ok) {
                alert('Rating submitted successfully');
            } else {
                alert('Failed to submit rating');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('An error occurred while submitting the rating');
        }
    };

    const addTreeMarkers = useCallback(() => {
        if (!map.current) return;

        trees.forEach((tree) => {
            console.log('Adding marker for tree:', tree);
            const el = document.createElement('div');
            el.className = 'tree-marker';
            el.innerHTML = '🌳';

            const popup = new maplibregl.Popup({
                offset: 25,
                maxWidth: '400px'
            })
                .setHTML(`
          <div class="p-4">
            <h2 class="text-2xl font-bold mb-2">${tree.name}</h2>
            <p class="text-lg italic mb-4">${tree.latinName}</p>
            <div id="tree-photo-carousel-${tree._id}"></div>
            <p class="text-xl mb-2">Rating: ${tree.averageRating.toFixed(1)} ⭐</p>
            <p class="text-base mb-4">${tree.description || 'No description available.'}</p>
            <div id="tree-report-form-${tree._id}"></div>
            <div id="tree-rating-form-${tree._id}"></div>
          </div>
        `);

            const marker = new maplibregl.Marker(el)
                .setLngLat(tree.location.coordinates)
                .setPopup(popup)
                .addTo(map.current);

            marker.getElement().addEventListener('click', () => {
                setTimeout(() => {
                    const carouselContainer = document.getElementById(`tree-photo-carousel-${tree._id}`);
                    if (carouselContainer) {
                        const root = createRoot(carouselContainer);
                        root.render(<TreePhotoCarousel photos={tree.photos} />);
                    }

                    const reportFormContainer = document.getElementById(`tree-report-form-${tree._id}`);
                    if (reportFormContainer) {
                        const root = createRoot(reportFormContainer);
                        root.render(
                            <TreeReportForm
                                treeId={tree._id!.toString()}
                                onReportSubmit={(report) => handleReportSubmit(tree._id!.toString(), report)}
                            />
                        );
                    }

                    const ratingFormContainer = document.getElementById(`tree-rating-form-${tree._id}`);
                    if (ratingFormContainer) {
                        const root = createRoot(ratingFormContainer);
                        root.render(
                            <TreeRatingForm
                                treeId={tree._id!.toString()}
                                onRatingSubmit={(rating) => handleRatingSubmit(tree._id!.toString(), rating)}
                            />
                        );
                    }
                }, 0);
            });
        });
    }, [trees, handleReportSubmit, handleRatingSubmit]);

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
            {trees.length > 0 && (
                <button
                    onClick={flyToFirstTree}
                    className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md"
                >
                    Fly to First Tree
                </button>
            )}
        </div>
    );
}