import { Progress } from "@heroui/react";
import { Outlet, useNavigation } from "react-router";
import { Toaster } from "sonner";

import { Providers } from "~/pages/provider";

export default function Layout() {
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  return (
    <Providers>
      <Progress
        className='fixed top-0 right-0 left-0 z-50'
        hidden={!isLoading}
        isIndeterminate
        size='sm'
      />
      <Outlet />
      <Toaster richColors />
    </Providers>
  );
}
