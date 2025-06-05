import { Image, Link } from "@heroui/react";
import { LucideCode2 } from "lucide-react";

export default function Page() {
  return (
    <div className='container flex h-full flex-col items-center justify-between py-10'>
      <div></div>
      <div className='flex flex-col gap-3 text-center'>
        <Image
          alt='Group Chat'
          className='h-96 w-full'
          src='/assets/undraw_group-chat.svg'
        />
        <h2 className='text-2xl font-bold'>Welcome to Chat Application</h2>
        <p className='max-w-xl text-gray-400'>
          This is a simple chat application built with React, Nest.js, and
          TypeScript. It allows users to create accounts, log in, and chat with
          others in real-time.
        </p>
      </div>
      <div>
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
      </div>
    </div>
  );
}
