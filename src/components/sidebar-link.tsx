"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

export default function SidebarLink(props: SidebarLinkProps) {
  const { href, icon, label } = props;

  const pathname = usePathname();

  const active = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`${
          active ? "bg-white/5" : "hover:bg-white/5"
        } w-full px-2.5 py-2  rounded-md flex items-center gap-2`}
      >
        <div className="p-1 bg-neutral-300 rounded-[8px] flex items-center justify-center text-accent font-medium leading-6">
          {icon}
        </div>
        {label}
      </div>
    </Link>
  );
}
