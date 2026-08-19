import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

import { Sidebar } from "@/lib/types/sidebar-types"

import { ChevronLeft, Dot } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"


type UseSidebarContantProps = {
  items: Sidebar[]
}


export default function UseSidebarContant({
  items
}: UseSidebarContantProps){

    const pathname = usePathname()

    const [openMenus, setOpenMenus] = useState<string[]>([])


    const toggleMenu = (title: string) => {
      setOpenMenus(prev => 
        prev.includes(title) 
          ? prev.filter(t => t !== title)
          : [...prev, title]
      )
    }


    return(
    <SidebarContent>

        <SidebarGroup>

          <SidebarGroupLabel className="text-gray-500">
            منوی اصلی
          </SidebarGroupLabel>


          <SidebarGroupContent>

            <SidebarMenu>

              {items.map((item) => {

                const isActive = pathname === item.href

                const hasSubItems = item.subItems && item.subItems.length > 0

                const isOpen = openMenus.includes(item.title)


                return (

                  <SidebarMenuItem key={item.id}>


                    <SidebarMenuButton 
                      asChild={!hasSubItems}
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive 
                        ? "bg-primary-50 text-primary font-medium" 
                        : ""
                      }
                      onClick={() => hasSubItems && toggleMenu(item.title)}
                    >


                      {hasSubItems ? (

                        <div className="flex items-center justify-between w-full">

                          <div className="flex items-center gap-3 mt-2">

                            <item.icon 
                              className={`h-5 w-5 ${
                                isActive 
                                ? "text-primary" 
                                : "text-gray-500"
                              }`} 
                            />


                            <span 
                              className={
                                isActive 
                                ? "text-primary" 
                                : "text-gray-700"
                              }
                            >
                              {item.title}
                            </span>

                          </div>


                          <ChevronLeft 
                            className={`h-4 w-4 transition-transform ${
                              isOpen ? "rotate-90" : ""
                            }`} 
                          />

                        </div>


                      ) : (


                        <Link 
                          href={item.href} 
                          className="flex items-center gap-3 mt-2"
                        >

                          <item.icon 
                            className={`h-5 w-5 ${
                              isActive 
                              ? "text-primary" 
                              : "text-gray-500"
                            }`} 
                          />


                          <span 
                            className={
                              isActive 
                              ? "text-primary" 
                              : "text-gray-700"
                            }
                          >
                            {item.title}
                          </span>


                        </Link>

                      )}


                    </SidebarMenuButton>



                    {hasSubItems && isOpen && (

                      <SidebarMenuSub className="border-none">

                        {item.subItems?.map((subItem) => (

                          <SidebarMenuSubItem key={subItem.id}>


                            <SidebarMenuSubButton 
                              asChild 
                              isActive={pathname === subItem.href}
                            >

                              <Link 
                                href={subItem.href} 
                                className="flex items-center gap-2 text-text-main"
                              >

                                <Dot className="fill-current text-primary" />

                                <span>
                                  {subItem.title}
                                </span>

                              </Link>


                            </SidebarMenuSubButton>


                          </SidebarMenuSubItem>

                        ))}

                      </SidebarMenuSub>

                    )}


                  </SidebarMenuItem>

                )

              })}


            </SidebarMenu>

          </SidebarGroupContent>

        </SidebarGroup>

      </SidebarContent>
    )
}