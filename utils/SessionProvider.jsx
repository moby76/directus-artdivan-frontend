'use client'

import { SessionProvider } from 'next-auth/react' 

export default function SessProvider({ children }) {
    return(
        <SessionProvider
            // refetchOnWindowFocus={false}
            // refetchInterval={30}            
        >
            {children}
        </SessionProvider>
    )
}