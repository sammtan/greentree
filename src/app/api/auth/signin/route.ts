// src/app/api/auth/signin/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { UserModel } from '@/models/UserModel';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        const client = await clientPromise;
        const db = client.db("greentree");
        const userModel = new UserModel(db);

        const user = await userModel.getUserByUsername(username);
        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Set a cookie to maintain the session
        cookies().set('user', JSON.stringify({ id: user._id, username: user.username }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600, // 1 hour
            path: '/',
        });

        return NextResponse.json({ message: 'Signed in successfully', username: user.username });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to sign in' }, { status: 500 });
    }
}