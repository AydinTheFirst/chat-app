import { Progress } from "@heroui/react";
import { type MetaFunction, Outlet, useNavigation } from "react-router";
import { Toaster } from "sonner";
import { SWRConfig } from "swr";

import { DactolyProvider } from "~/context/dactoly-context";
import { fetcher, handleError } from "~/lib/http";
import { Providers } from "~/pages/provider";

export const meta: MetaFunction = () => {
  return [
    { title: "Dactoly" },
    {
      content:
        "Dactoly is a modern, open-source chat application built with React and Nest.js",
      name: "description"
    },
    {
      content: "Dactoly, chat, open-source, React, Nest.js",
      name: "keywords"
    },
    { content: "index, follow", name: "robots" }
  ];
};

export default function Layout() {
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  return (
    <Providers>
      <SWRConfig
        value={{
          fetcher,
          onError: handleError
        }}
      >
        <Progress
          aria-label='Loading'
          className='fixed top-0 right-0 left-0 z-50'
          hidden={!isLoading}
          isIndeterminate
          size='sm'
        />
        <DactolyProvider>
          <Outlet />
        </DactolyProvider>
        <Toaster richColors />
      </SWRConfig>
    </Providers>
  );
}
