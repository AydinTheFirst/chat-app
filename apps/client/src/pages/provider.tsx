import { HeroUIProvider } from "@heroui/react";
import { useHref, useNavigate } from "react-router";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  return (
    <HeroUIProvider
      navigate={navigate}
      useHref={useHref}
      validationBehavior='native'
    >
      {children}
    </HeroUIProvider>
  );
};
