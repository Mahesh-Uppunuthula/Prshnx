import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpRight,
  ChevronsUpDown,
  Headset,
  LayoutGrid,
  LibraryBig,
  LogOut,
  LucideTextCursorInput,
  MessageSquare,
  SparklesIcon,
  TriangleAlert,
  User,
  Wrench,
} from "lucide-react";
import { Button } from "./ui/button";
import { BRAND } from "@/lib/constants";
import { Link } from "@tanstack/react-router";
import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function AppSidebar() {
  const { state, openMobile, setOpen } = useSidebar();
  return (
    <Sidebar
      collapsible="icon"
      className={cn("group/sidebar", {
        "cursor-w-resize": state === "collapsed" && !openMobile,
      })}
      onClick={() => setOpen(true)}
    >
      <SidebarHeader>
        <div className="flex gap-3">
          <Button
            size={"icon"}
            className={cn("size-8 rounded-sm", {
              "group-hover:hidden": state === "collapsed" && !openMobile,
            })}
          >
            <LucideTextCursorInput className="size-4" />
          </Button>

          {(state === "expanded" || openMobile) && (
            <div className="flex flex-col justify-between">
              <span className="leading-4 font-medium text-foreground">
                {BRAND.name}
              </span>
              <span className="text-sm text-start">Free</span>
            </div>
          )}

          {!openMobile && state === "collapsed" && (
            <Button
              variant={"secondary"}
              size={"icon"}
              className="size-8 hidden group-hover:block rounded-sm"
            >
              <SidebarTrigger
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  event.stopPropagation();
                  setOpen(false);
                }}
              />
            </Button>
          )}
          {!openMobile && state === "expanded" && (
            <SidebarTrigger
              className="text-muted-foreground ml-auto"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                setOpen(false);
              }}
            />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="w-full justify-between">
        <SidebarGroup className="gap-2">
          <Link
            to="/dashboard"
            activeProps={{
              className: "bg-muted text-foreground",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarMenuButton
              tooltip={"Dashboard"}
              className="w-full flex place-items-center text-foreground cursor-pointer"
            >
              <LayoutGrid />
              Dashboard
            </SidebarMenuButton>
          </Link>
          <Link
            to="/forms"
            activeProps={{
              className: "bg-muted text-foreground",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarMenuButton
              className="w-full flex place-items-center text-foreground cursor-pointer"
              tooltip={"Forms"}
            >
              <LibraryBig />
              Forms
            </SidebarMenuButton>
          </Link>
          <Link
            to="/form-builder"
            activeProps={{
              className: "bg-muted text-foreground",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarMenuButton
              tooltip={"Form Builder"}
              className="w-full flex place-items-center text-foreground cursor-pointer"
            >
              <Wrench />
              Form Builder
            </SidebarMenuButton>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link
            to="/help-center"
            target="_blank"
            activeProps={{
              className: "bg-muted text-foreground",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarMenuButton
              tooltip={"Help Center"}
              className={cn(
                "w-full flex place-items-center text-foreground group/helpCenter cursor-pointer"
              )}
            >
              <Headset />
              Help Center
              <ArrowUpRight className="invisible group-hover/helpCenter:visible ml-auto" />
            </SidebarMenuButton>
          </Link>
          <Link
            to="/share-feedback"
            activeProps={{
              className: "bg-muted text-foreground",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarMenuButton
              tooltip={"Share Feedback"}
              className="flex gap-2 place-items-start justify-start text-foreground cursor-pointer"
            >
              <MessageSquare />
              Share Feedback
            </SidebarMenuButton>
          </Link>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="overflow-hidden">
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}

const AppSidebarFooter = () => {
  const { state, openMobile } = useSidebar();
  const getUserDetails = useQuery(userQueryOptions.getUserDetails);

  console.log(
    "app-sidebar-footer",
    getUserDetails.isError,
    getUserDetails.data,
    getUserDetails.data?.user
  );

  if (
    getUserDetails.isError ||
    !getUserDetails.data ||
    !getUserDetails.data.user
  ) {
    return (
      <a href="/api/auth/logout">
        <SidebarMenuButton
          tooltip={"Error fetching user details"}
          className="text-red-400"
        >
          <TriangleAlert />
          Error: Click to logout
        </SidebarMenuButton>
      </a>
    );
  }
  const user = getUserDetails.data.user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-full flex gap-3 [&>*]:cursor-pointer">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size={"icon"} className="size-8 rounded-b-sm">
                <User />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <span>User Details</span>
            </TooltipContent>
          </Tooltip>
          {(state === "expanded" || openMobile) && (
            <div className="w-[65%] overflow-clip text-ellipsis flex flex-col justify-between place-items-start">
              <span className="text-base leading-4 font-medium text-foreground">
                {user.given_name}
              </span>
              <span className="w-full text-sm font-normal text-ellipsis overflow-hidden whitespace-nowrap">
                {user.email}
              </span>
            </div>
          )}
          <div>
            {(state === "expanded" || openMobile) && (
              <Button variant={"ghost"}>
                <ChevronsUpDown />
              </Button>
            )}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={openMobile ? "start" : "end"}
        side={openMobile ? "top" : "right"}
        sideOffset={20}
        alignOffset={openMobile ? 10 : 40}
      >
        <DropdownMenuLabel>
          <div className="flex gap-3">
            <Button size={"icon"} className="size-8 rounded-b-sm">
              <User />
            </Button>
            <div className="w-full flex flex-col justify-between place-items-start">
              <span className="text-md leading-4 font-medium text-foreground">
                {user.given_name}
              </span>
              <span className="text-sm font-normal">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SparklesIcon />
          Upgrade to pro
        </DropdownMenuItem>

        <DropdownMenuItem variant="destructive" asChild>
          <a href="/api/auth/logout">
            <LogOut />
            Log out
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem inert className="text-muted-foreground">
          You are using free plan
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
