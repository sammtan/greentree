import { MongoClient, Db, Collection, WithId, Document } from 'mongodb';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface TreeRating {
    id: string;
    rating: number;
    createdAt: Date;
}

export interface TreeReport {
    id: string;
    description: string;
    createdAt: Date;
}

export interface Tree {
    _id?: ObjectId;
    id: string;
    name: string;
    latinName: string;
    description?: string;
    location: {
        type: "Point";
        coordinates: [number, number];
    };
    photos: string[];
    ratings: TreeRating[];
    reports: TreeReport[];
    totalRatings: number;
    ratingSum: number;
    averageRating: number;
    isActive: boolean;
}

export class TreeModel {
    private db: Db;
    private collection: Collection<Tree>;

    constructor() {
        this.initDatabase();
    }

    private async initDatabase() {
        const client = await clientPromise;
        this.db = client.db("greentree");
        this.collection = this.db.collection<Tree>('trees');
    }

    async getAllTrees(): Promise<Tree[]> {
        await this.initDatabase();
        const trees = await this.collection.find({ isActive: true }).toArray();
        return trees.map(tree => ({
            ...tree,
            id: tree._id!.toString()
        }));
    }

    async getTreeById(id: string): Promise<Tree | null> {
        await this.initDatabase();
        const tree = await this.collection.findOne({ _id: new ObjectId(id) });
        if (tree) {
            return {
                ...tree,
                id: tree._id.toString()
            };
        }
        return null;
    }

    async fetchTrees(): Promise<Tree[]> {
        await this.initDatabase();
        const trees = await this.collection.find({}).toArray();
        return trees.map(tree => ({
            ...tree,
            id: tree._id!.toString()
        }));
    }
}