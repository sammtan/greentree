import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AddTreeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (treeData: any) => void;
}

export function AddTreeDialog({ isOpen, onClose, onSubmit }: AddTreeDialogProps) {
  const [treeData, setTreeData] = useState({
    name: '',
    latinName: '',
    description: '',
    photos: [''],
    location: { type: 'Point', coordinates: [0, 0] }
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getLocation = () => {
    setIsGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTreeData(prev => ({
            ...prev,
            location: {
              type: 'Point',
              coordinates: [position.coords.longitude, position.coords.latitude]
            }
          }));
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Failed to get location. Please try again.');
          setIsGettingLocation(false);
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...treeData,
      isActive: true,
      ratings: [],
      reports: [],
      totalRatings: 0,
      ratingSum: 0,
      averageRating: 0
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Tree</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tree Name</Label>
            <Input
              id="name"
              value={treeData.name}
              onChange={(e) => setTreeData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="latinName">Latin Name</Label>
            <Input
              id="latinName"
              value={treeData.latinName}
              onChange={(e) => setTreeData(prev => ({ ...prev, latinName: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={treeData.description}
              onChange={(e) => setTreeData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photos">Photo URL</Label>
            <Input
              id="photos"
              value={treeData.photos[0]}
              onChange={(e) => setTreeData(prev => ({ ...prev, photos: [e.target.value] }))}
              placeholder="https://example.com/tree-photo.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={getLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? 'Getting Location...' : 'Get Current Location'}
              </Button>
              <Input
                value={`${treeData.location.coordinates[0]}, ${treeData.location.coordinates[1]}`}
                readOnly
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Tree</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

