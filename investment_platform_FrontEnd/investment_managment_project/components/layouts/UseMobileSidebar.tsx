// components/MobileMenuButton.tsx
'use client'
import { useSidebar } from "@/components/ui/sidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MobileSidebar() {
  const { toggleSidebar } = useSidebar()
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="fixed top-4 right-4 z-50 lg:hidden"
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}