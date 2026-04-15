"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { PlayerProvider } from "@/components/ui/player-context";
import { TamboProvider } from "@tambo-ai/react";
import { TamboMcpProvider } from "@tambo-ai/react/mcp";
import { useEffect, useState } from "react";

const USER_KEY_STORAGE = "tambo-user-key";

function useAnonymousUserKey(): string | undefined {
  const [userKey, setUserKey] = useState<string | undefined>(undefined);
  useEffect(() => {
    let key = localStorage.getItem(USER_KEY_STORAGE);
    if (!key) {
      key = crypto.randomUUID();
      localStorage.setItem(USER_KEY_STORAGE, key);
    }
    setUserKey(key);
  }, []);
  return userKey;
}

export default function Home() {
  const mcpServers = useMcpServers();
  const userKey = useAnonymousUserKey();

  if (!userKey) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        tools={tools}
        tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
        mcpServers={mcpServers}
        userKey={userKey}
      >
        <TamboMcpProvider>
          <PlayerProvider>
            <div className="w-full max-w-4xl mx-auto flex-1 min-h-0 flex flex-col">
              <MessageThreadFull />
            </div>
          </PlayerProvider>
        </TamboMcpProvider>
      </TamboProvider>
    </div>
  );
}
