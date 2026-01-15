// app/admin/layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
      </nav>
      <main className="p-8">{children}</main>
    </div>
  )
}