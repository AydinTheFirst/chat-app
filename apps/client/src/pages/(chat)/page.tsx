import { Image, Link, Navbar, NavbarContent } from "@heroui/react";
import { LucideCode2 } from "lucide-react";

import SidebarToggler from "./sidebar-toggler";

export default function Page() {
  return (
    <div className='flex min-h-screen flex-col gap-3'>
      <Navbar
        className='bg-content1'
        maxWidth='full'
      >
        <NavbarContent justify='start'>
          <SidebarToggler className='md:hidden' />
          <Link
            className='text-3xl font-bold'
            color='foreground'
            href='/'
          >
            ChatApp
          </Link>
        </NavbarContent>
      </Navbar>
      <div className='flex-1'>
        <main className='flex flex-col items-center justify-center gap-3 p-4'>
          <Image
            alt='Group Chat'
            className='h-96 w-full'
            src='/assets/undraw_group-chat.svg'
          />
          <h2 className='text-2xl font-bold'>Welcome to Chat Application</h2>
          <p className='max-w-xl text-gray-400'>
            This is a simple chat application built with React, Nest.js, and
            TypeScript. It allows users to create accounts, log in, and chat
            with others in real-time.
          </p>
        </main>
      </div>
      <footer className='p-4'>
        <p className='text-center text-gray-400'>
          <LucideCode2 className='mx-auto mb-1' />
          <span>
            Developed and Designed by{" "}
            <Link
              color='foreground'
              href='https://aydinthefirst.com'
              isExternal
            >
              AydinTheFirst
            </Link>
          </span>
        </p>
      </footer>
    </div>
  );
}
