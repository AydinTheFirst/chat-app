import { createContext, useCallback, useState } from "react";

interface SidebarContextType {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  toggle: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);

export const SidebarProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const onOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, onOpenChange, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};
