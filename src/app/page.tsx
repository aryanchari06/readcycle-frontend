"use client";

import { IconLoader3 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/home");
  });
  return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <IconLoader3 className="animate-spin" />
    </div>
  );
}
