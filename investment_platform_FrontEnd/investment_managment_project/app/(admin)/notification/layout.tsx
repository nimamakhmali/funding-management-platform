export default function NotificationLayout({
  children,
  content,
}: {
  children: React.ReactNode
  content: React.ReactNode
}) {
  return (
    <>
      {children}
      {content}
    </>
  )
}