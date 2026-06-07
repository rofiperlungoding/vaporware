"use client";

import { useEffect } from "react";
import { getSessionId } from "@/lib/session";

export default function PendoInit() {
  useEffect(() => {
    pendo.initialize({
      visitor: {
        id: getSessionId(),
      },
    });
  }, []);

  return null;
}
