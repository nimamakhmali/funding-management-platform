// components/ProjectStatus.tsx
"use client"

interface ProjectStatusProps {
  status: string
}

const statusStyles: Record<string, string> = {
  "فعال": "bg-green-100 text-green-800",
  "در انتظار": "bg-yellow-100 text-yellow-800",
  "تکمیل شده": "bg-blue-100 text-blue-800",
}

export default function ProjectStatus({ status }: ProjectStatusProps) {
  const styleClass = statusStyles[status] || "bg-gray-100 text-gray-800"
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styleClass}`}>
      {status}
    </span>
  )
}