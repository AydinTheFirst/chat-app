import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { Outlet } from "react-router";

import ToggleTheme from "~/components/toggle-theme";
import { AuthProvider } from "~/context/auth-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

function Layout() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar className='shadow'>
        <NavbarContent>
          <NavbarBrand>
            <span className='text-xl font-bold'>Dactoly.dev</span>
          </NavbarBrand>
          <NavbarContent justify='end'>
            <NavbarItem>
              <ToggleTheme />
            </NavbarItem>
          </NavbarContent>
        </NavbarContent>
      </Navbar>

      <main className='container flex-1 py-4'>
        <Outlet />
      </main>

      <footer>
        <div className='container mx-auto py-4 text-center'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            &copy; {new Date().getFullYear()} Dactoly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
