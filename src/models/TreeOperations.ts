import { ObjectId } from 'mongodb';
import { Tree, TreeRating, TreeReport } from './TreeModel';
import clientPromise from '@/lib/mongodb';

export async function rateTree(treeId: string, rating: number): Promise<void> {
    const client = await clientPromise;
    const db = client.db("greentree");
    const collection = db.collection<Tree>('trees');

    const treeRating: TreeRating = {
        id: new ObjectId().toString(),
        rating: Number(rating),
        createdAt: new Date(),
    };

    await collection.updateOne(
        { _id: new ObjectId(treeId) },
        {
            $push: { ratings: treeRating },
            $inc: { totalRatings: 1, ratingSum: Number(rating) }
        }
    );

    const updatedTree = await collection.findOne({ _id: new ObjectId(treeId) });
    if (updatedTree) {
        const newAverageRating = updatedTree.ratingSum / updatedTree.totalRatings;
        await collection.updateOne(
            { _id: new ObjectId(treeId) },
            { $set: { averageRating: newAverageRating } }
        );
    }
}

export async function reportTree(treeId: string, description: string): Promise<void> {
    const client = await clientPromise;
    const db = client.db("greentree");
    const collection = db.collection<Tree>('trees');

    const report: TreeReport = {
        id: new ObjectId().toString(),
        description,
        createdAt: new Date(),
    };

    await collection.updateOne(
        { _id: new ObjectId(treeId) },
        { $push: { reports: report } }
    );
}