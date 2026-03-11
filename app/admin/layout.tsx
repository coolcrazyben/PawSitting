export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-nunito bg-gray-100">{children}</body>
    </html>
  )
}
