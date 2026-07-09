"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import authClient from "@/lib/auth-client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Loader2, LogOut, Settings } from "lucide-react";
import { toast } from "sonner";

type UserNavProps = {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string | null;
  } | null;
};

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await authClient.signOut();

      toast.success("Logged out successfully.");

      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Unable to logout.");
    } finally {
      setLoading(false);
    }
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-[#f6eadf]"
          />
        }
      >
        <Avatar className="cursor-pointer size-10">
          <AvatarFallback className="bg-[#6f3e1d] text-[#fff8ef]">
            {initials}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-64 rounded-2xl border border-[#ead7c4] p-0 shadow-xl"
      >
        <div className="border-b border-[#f3e7db] p-4">
          <p className="font-semibold text-[#3d2413]">{user?.name}</p>

          <p className="mt-1 text-sm text-[#7b5f46]">{user?.email}</p>

          {user?.role && (
            <span className="mt-3 inline-flex rounded-full bg-[#f8ede1] px-2 py-1 text-xs font-medium uppercase text-[#8d5a2b]">
              {user.role}
            </span>
          )}
        </div>

        <div className="space-y-1 p-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => router.push("/admin/settings")}
          >
            <Settings className="mr-2 size-4" />
            Settings
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-600"
            disabled={loading}
            onClick={handleLogout}
          >
            {loading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 size-4" />
            )}
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
