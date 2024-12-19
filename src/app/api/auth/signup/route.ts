// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { UserModel } from '@/models/UserModel';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        const client = await clientPromise;
        const db = client.db("greentree");
        const userModel = new UserModel(db);

        const existingUser = await userModel.getUserByUsername(username);
        if (existingUser) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
        }

        const newUser = await userModel.createUser(username, password);
        return NextResponse.json({ message: 'User created successfully', userId: newUser._id });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}