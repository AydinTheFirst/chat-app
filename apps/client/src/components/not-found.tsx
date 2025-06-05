import { Image, Link } from "@heroui/react";

export default function NotFound() {
  return (
    <main className='container h-screen'>
      <div className='center h-full flex-col gap-4 text-center'>
        <Image
          className='h-96'
          src='/assets/not-found.svg'
        />
        <h1 className='text-7xl font-bold'>404</h1>
        <p className='text-lg text-gray-500'>
          The requested page could not be found.
        </p>
        <Link
          color='foreground'
          href='/'
        >
          Go back to home
        </Link>
      </div>
    </main>
  );
}
