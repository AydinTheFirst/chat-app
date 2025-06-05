import { Spinner } from "@heroui/react";

export function HydrateFallback() {
  return (
    <div className='container grid h-screen place-items-center'>
      <Spinner aria-label='Loading content' />
    </div>
  );
}
