'use client'

import { QueryClient, QueryClientProvider, Hydrate } from "@tanstack/react-query";
// import { SessionProvider } from 'next-auth/react' 
import { useState } from "react"

export default function Providers({ children }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
          },
        },
      }));

    return (
      // <SessionProvider>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
      // </SessionProvider>        
    );
}
