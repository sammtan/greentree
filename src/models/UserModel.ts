import { ObjectId } from 'mongodb';

export interface User {
    _id?: ObjectId;
    username: string;
    password: string;
    role: 'user' | 'admin';
    createdAt: Date;
}

export class UserModel {
    private db;

    constructor(db: any) {
        this.db = db;
    }

    async createUser(username: string, password: string): Promise<User> {
        const user: User = {
            username,
            password,
            createdAt: new Date(),
            role: 'user'
        };
        const result = await this.db.collection('users').insertOne(user);
        return { ...user, _id: result.insertedId };
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return await this.db.collection('users').findOne({ username });
    }
}