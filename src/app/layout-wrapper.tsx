import type { Metadata } from "next";
import HomePageLayout from './layout';

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "GreenTree Companion 🌳",
    description: "An app to help you see trees nearby in your campus.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <HomePageLayout>
            <div className={`${inter.className}`}>
                {children}
            </div>
        </HomePageLayout>
    );
}