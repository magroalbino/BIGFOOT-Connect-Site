import './globals.css';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-gray-50 text-black">
                <div className="flex min-h-screen">
                    <Sidebar />
                    <div className="flex-1 flex flex-col">
                        <Topbar />
                        <main className="p-6">{children}</main>
                    </div>
                </div>
            </body>
        </html>
    );
}
