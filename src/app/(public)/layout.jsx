import { PublicNavbar } from '@/components/public/PublicNavbar';

export default function PublicLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <PublicNavbar />
            <main className="flex-1 flex flex-col">
                {children}
            </main>
        </div>
    );
}
