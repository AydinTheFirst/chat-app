import { Link, Navbar, NavbarContent } from "@heroui/react";
import React from "react";

import { StyledButton } from "~/components/styled-button";

export default function Page() {
  return (
    <div className='flex h-screen flex-col gap-3'>
      <Navbar maxWidth='2xl'>
        <NavbarContent justify='start'>
          <h1 className='text-lg font-semibold'>Page Title</h1>
        </NavbarContent>
        <NavbarContent justify='end'>
          <StyledButton
            as={Link}
            href='/app'
          >
            Start Chatting
          </StyledButton>
        </NavbarContent>
      </Navbar>

      <main className='container flex-1'>
        <div className='p-4'>
          <h2 className='text-xl font-bold'>Welcome to the Page</h2>
          <p className='mt-2 text-gray-700'>
            This is a simple page layout example using React and Heroui.
          </p>
        </div>
      </main>

      <footer>
        <div className='text-center text-sm text-gray-500'>
          © {new Date().getFullYear()} My Application
        </div>
      </footer>
    </div>
  );
}
