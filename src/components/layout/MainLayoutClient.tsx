'use client';

import Header from '@/components/global/layout/Header';
import Footer from '@/components/global/layout/Footer';

interface MainLayoutClientProps {
    children: React.ReactNode;
}

export default function MainLayoutClient({ children }: MainLayoutClientProps) {
    return (
        <div className="min-h-screen bg-soft-beige">
            <Header />
            <main className="pt-20">{children}</main>
            <Footer />
        </div>
    );
} 