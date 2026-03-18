import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[var(--background)] overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto w-full p-4 md:p-8 pt-20 md:pt-8 bg-[var(--background)] transition-colors duration-300">
                <div className="container mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
