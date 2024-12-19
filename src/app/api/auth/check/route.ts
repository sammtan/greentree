import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const userCookie = cookies().get('user');
    if (userCookie) {
        const user = JSON.parse(userCookie.value);
        return NextResponse.json({ isSignedIn: true, username: user.username });
    }
    return NextResponse.json({ isSignedIn: false });
}