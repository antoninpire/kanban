import SidebarLink from "@/components/sidebar-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { db } from "@/lib/db";
import {
  Check,
  ChevronsUpDown,
  FolderKanban,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type SidebarSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

function SidebarSection(props: SidebarSectionProps) {
  const { title, children, className } = props;

  return (
    <div className={className}>
      <p className="text-xs ml-3 font-semibold text-accent-foreground">
        {title}
      </p>
      <div className="flex flex-col gap-0.5 text-sm pt-1.5">{children}</div>
    </div>
  );
}

type SidebarProps = {
  user: {
    userId: string;
    email: string;
  };
  workspaceId: string;
  projectId: string;
};

export default async function Sidebar(props: SidebarProps) {
  const { user, workspaceId } = props;

  const [workspacesByUser, projects] = await Promise.all([
    db.query.workspacesByUsers.findMany({
      where: (table, { eq }) => eq(table.userId, user.userId),
      with: {
        workspace: true,
      },
    }),
    db.query.projects.findMany({
      where: (table, { eq }) => eq(table.workspaceId, workspaceId),
      orderBy: (table, { asc }) => asc(table.name),
    }),
  ]);

  if (!workspacesByUser.some((ws) => ws.userId === user.userId))
    redirect("/app");

  return (
    <aside className="w-64 inset-0 fixed h-screen bg-white/5 py-6 px-4 flex flex-col justify-between">
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              Select workspace
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder="Search workspaces..."
                className="text-sm"
              />
              <CommandEmpty className="text-sm">
                No worksapce found.
              </CommandEmpty>
              <CommandGroup className="text-sm">
                {workspacesByUser.map((workspaceByUser) => (
                  <Link
                    href={`/app/${workspaceByUser.workspaceId}`}
                    key={workspaceByUser.workspaceId}
                  >
                    <div
                      className="flex items-center justify-between
                      } px-2 py-1.5 rounded-[7px] hover:bg-white/5"
                    >
                      {workspaceByUser.workspace.name}
                      {workspaceByUser.workspaceId === workspaceId && (
                        <Check className="w-4 h-4" />
                      )}
                    </div>
                  </Link>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <SidebarSection title="General" className="mt-5">
          <SidebarLink
            href={`/app/${workspaceId}`}
            icon={<FolderKanban className="w-4 h-4" />}
            label="Projects"
          />
          <SidebarLink
            href={`/app/${workspaceId}/settings`}
            icon={<Settings className="w-4 h-4" />}
            label="Settings"
          />
        </SidebarSection>
        <SidebarSection title="Your Projects" className="mt-8">
          {!projects.length && (
            <p className="text-neutral-500 text-center mt-5 text-sm">
              No projects yet.
            </p>
          )}
          {projects.map((project) => (
            <SidebarLink
              href={`/app/${workspaceId}/${project.id}`}
              key={project.id}
              icon={<FolderKanban className="w-4 h-4" />}
              label={project.name}
            />
          ))}
        </SidebarSection>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="justify-between py-3 px-1">
            <div className="flex items-center gap-1 max-w-[85%] truncate">
              <Avatar className="w-7 h-7">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/micah/svg?seed=${encodeURI(
                    user.email
                  )}`}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="text-xs">{user.email}</p>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[14rem] px-1.5 py-2.5 text-sm">
          <Link href="/app/settings">
            <div className="w-full px-2.5 py-2 rounded-md flex items-center gap-2 hover:bg-white/5">
              <Settings className="w-4 h-4" />
              Settings
            </div>
          </Link>
          <form method="POST" action="/api/auth/sign-out">
            <button
              type="submit"
              className="w-full px-2.5 py-2 rounded-md flex items-center gap-2 hover:bg-white/5 hover:text-red-500"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </PopoverContent>
      </Popover>
    </aside>
  );
}
