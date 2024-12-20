import { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tree } from '@/models/TreeModel';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface TreesTableProps {
  trees: Tree[];
  isAdmin?: boolean;
  onDeleteTree?: (treeId: string) => void;
}

export function TreesTable({ trees, isAdmin, onDeleteTree }: TreesTableProps) {
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    treeId: '',
    treeName: '',
    treeLatinName: '',
    confirmName: '',
    confirmLatinName: ''
  });

  const handleDelete = async () => {
    if (deleteDialog.confirmName === deleteDialog.treeName &&
      deleteDialog.confirmLatinName === deleteDialog.treeLatinName) {
      onDeleteTree?.(deleteDialog.treeId);
      setDeleteDialog({ isOpen: false, treeId: '', treeName: '', treeLatinName: '', confirmName: '', confirmLatinName: '' });
    }
  };

  return (
    <>
      <Table>
        <TableCaption>List of Registered Trees</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Latin Name</TableHead>
            <TableHead>Average Rating</TableHead>
            <TableHead>Location</TableHead>
            {isAdmin && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {trees.map((tree) => (
            <TableRow key={tree._id ? tree._id.toString() : undefined}>
              <TableCell>{tree.name}</TableCell>
              <TableCell>{tree.latinName}</TableCell>
              <TableCell>{tree.averageRating.toFixed(1)}</TableCell>
              <TableCell>{`${tree.location.coordinates[1]}, ${tree.location.coordinates[0]}`}</TableCell>
              {isAdmin && (
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialog({
                      isOpen: true,
                      treeId: tree._id!.toString(),
                      treeName: tree.name,
                      treeLatinName: tree.latinName,
                      confirmName: '',
                      confirmLatinName: ''
                    })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={deleteDialog.isOpen} onOpenChange={(isOpen) => !isOpen && setDeleteDialog(prev => ({ ...prev, isOpen: false }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tree</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please type the tree name and latin name to confirm deletion.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tree Name: {deleteDialog.treeName}</label>
              <Input
                value={deleteDialog.confirmName}
                onChange={(e) => setDeleteDialog(prev => ({ ...prev, confirmName: e.target.value }))}
                placeholder="Type tree name to confirm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Latin Name: {deleteDialog.treeLatinName}</label>
              <Input
                value={deleteDialog.confirmLatinName}
                onChange={(e) => setDeleteDialog(prev => ({ ...prev, confirmLatinName: e.target.value }))}
                placeholder="Type latin name to confirm"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteDialog(prev => ({ ...prev, isOpen: false }))}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteDialog.confirmName !== deleteDialog.treeName ||
                  deleteDialog.confirmLatinName !== deleteDialog.treeLatinName}
              >
                Delete Tree
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

