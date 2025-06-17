import { ThemeProvider } from "next-themes";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { SWRConfig } from "swr";

import { fetcher } from "~/lib/dactoly";

export default function Layout() {
  return (
    <>
      <ThemeProvider>
        <SWRConfig value={{ fetcher }}>
          <Outlet />
          <Toaster
            position='top-center'
            richColors
          />
        </SWRConfig>
      </ThemeProvider>
    </>
  );
}
