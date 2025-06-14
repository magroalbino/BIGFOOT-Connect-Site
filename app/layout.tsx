// app/layout.tsx
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br">
            <body className="flex bg-background">
                <Sidebar />
                <div className="flex-1">
                    <Header />
                    {children}
                </div>
            </body>
        </html>
    )
}
