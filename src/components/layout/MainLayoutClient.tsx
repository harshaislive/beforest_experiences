'use client';

import Header from '@/components/global/layout/Header';
import Footer from '@/components/global/layout/Footer';

interface MainLayoutClientProps {
    children: React.ReactNode;
}

export default function MainLayoutClient({ children }: MainLayoutClientProps) {
    return (
        <div className="min-h-screen flex flex-col bg-soft-beige">
            <Header />
            <main className="flex-1 pt-20 relative">{children}</main>
            <Footer />
        </div>
    );
} 