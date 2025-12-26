import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import type { ComponentPropsWithRef, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type NavBarProps = ComponentPropsWithRef<"nav"> & PropsWithChildren;

const NavBar: React.FC<NavBarProps> = ({ className, children }) => {
  return <nav className={cn(className, "flex")}>{children}</nav>;
};

const NavBarMobileTrigger = () => {
  const { isMobile } = useSidebar();
  return isMobile ? <SidebarTrigger /> : null;
};

export { NavBarMobileTrigger };
export default NavBar;
