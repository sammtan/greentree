import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tree } from '@/models/TreeModel';

interface TreesTableProps {
    trees: Tree[];
}

export function TreesTable({ trees }: TreesTableProps) {
    return (
        <Table>
            <TableCaption>List of Registered Trees</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Latin Name</TableHead>
                    <TableHead>Average Rating</TableHead>
                    <TableHead>Location</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {trees.map((tree) => (
                    <TableRow key={tree._id ? tree._id.toString() : undefined}>
                        <TableCell>{tree.name}</TableCell>
                        <TableCell>{tree.latinName}</TableCell>
                        <TableCell>{tree.averageRating.toFixed(1)}</TableCell>
                        <TableCell>{`${tree.location.coordinates[1]}, ${tree.location.coordinates[0]}`}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}