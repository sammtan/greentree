import { ObjectId } from 'mongodb';
import { Tree, TreeRating, TreeReport } from './TreeModel';
import clientPromise from '@/lib/mongodb';

export async function rateTree(treeId: string, username: string, rating: number): Promise<void> {
  const client = await clientPromise;
  const db = client.db("greentree");
  const collection = db.collection<Tree>('trees');

  const treeRating: TreeRating = {
    username,
    rating: Number(rating),
    createdAt: new Date(),
  };

  const result = await collection.updateOne(
    { _id: new ObjectId(treeId) },
    {
      $push: { ratings: treeRating },
      $inc: { totalRatings: 1, ratingSum: Number(rating) }
    }
  );

  if (result.modifiedCount === 0) {
    throw new Error('Tree not found or rating not added');
  }

  const updatedTree = await collection.findOne({ _id: new ObjectId(treeId) });
  if (updatedTree) {
    const newAverageRating = updatedTree.ratingSum / updatedTree.totalRatings;
    await collection.updateOne(
      { _id: new ObjectId(treeId) },
      { $set: { averageRating: newAverageRating } }
    );
  }
}

export async function reportTree(treeId: string, username: string, description: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("greentree");
  const collection = db.collection<Tree>('trees');

  const report: TreeReport = {
    username,
    description,
    createdAt: new Date(),
  };

  const result = await collection.updateOne(
    { _id: new ObjectId(treeId) },
    { $push: { reports: report } }
  );

  if (result.modifiedCount === 0) {
    throw new Error('Tree not found or report not added');
  }
}