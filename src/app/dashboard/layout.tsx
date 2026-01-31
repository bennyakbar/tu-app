import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const user = session.user;

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="hidden md:flex flex-shrink-0">
                <Sidebar user={user} />
            </div>
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header could go here */}
                <header className="md:hidden flex items-center justify-between px-4 py-2 bg-white border-b">
                    <span className="font-bold">TU App</span>
                    {/* Mobile menu trigger would go here */}
                </header>
                <main className="flex-1 overflow-y-auto focus:outline-none p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
