import { Navbar, NavbarContent } from "@heroui/react";
import React from "react";

import SidebarToggler from "~/components/sidebar-toggler";
import ToggleTheme from "~/components/toggle-theme";
import { useSidebar } from "~/hooks/use-sidebar";

export default function App() {
  const { isOpen } = useSidebar();

  return (
    <div className='flex h-full flex-col gap-3'>
      <Navbar
        className='bg-transparent'
        maxWidth='full'
      >
        <NavbarContent justify='start'>
          {!isOpen && <SidebarToggler />}
        </NavbarContent>
        <NavbarContent justify='end'>
          <ToggleTheme />
        </NavbarContent>
      </Navbar>

      <div className='container flex-1'>x</div>
      <footer>
        <div className='text-center text-sm text-gray-500'>
          © {new Date().getFullYear()} My Application
        </div>
      </footer>
    </div>
  );
}
