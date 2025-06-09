import {
  Button,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@heroui/react";
import { LucideBug } from "lucide-react";
import { isRouteErrorResponse, useRouteError } from "react-router";

import NotFound from "./not-found";

export function ErrorBoundary() {
  const error = useRouteError();

  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let statusCode: number | undefined;

  console.error("Route Error:", error);

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Page Not Found" : "Error";
    details = error.statusText || details;
    statusCode = error.status;
  }

  if (statusCode === 404) {
    return <NotFound />;
  }

  return (
    <>
      <main className='container h-screen'>
        <div className='center h-full flex-col gap-4 text-center'>
          <Image
            className='h-96'
            src='/assets/error-illustration.svg'
          />
          <h1 className='text-7xl font-bold'>{message}</h1>
          <p className='text-lg text-gray-500'>{details}</p>
          <Link
            color='foreground'
            href='/'
          >
            Go back to home
          </Link>
        </div>
      </main>
      {import.meta.env.DEV && <Devtools />}
    </>
  );
}

function Devtools() {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  const error = useRouteError();
  let errorMessage = "No error message available";
  let errorStack = "No stack trace available";

  if (error instanceof Error) {
    errorMessage = error.message || "No error message available";
    errorStack = error.stack || "No stack trace available";
  }

  return (
    <>
      <Button
        className='fixed right-4 bottom-4 z-50'
        isIconOnly
        onPress={onOpen}
        variant='light'
      >
        <LucideBug />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior='inside'
        size='5xl'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            {errorMessage}
          </ModalHeader>
          <ModalBody className='text-red-500'>
            <pre className='break-words whitespace-pre-wrap'>
              <code>{errorStack}</code>
            </pre>
            <p className='mt-2 text-sm text-gray-500'>
              This error occurred in development mode. Please check the console
              for more details.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color='danger'
              onPress={onClose}
              variant='light'
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
