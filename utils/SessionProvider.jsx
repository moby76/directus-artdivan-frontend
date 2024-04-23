'use client'

import { SessionProvider } from 'next-auth/react' 

export default function SProvider({ children, session }) {
    return(
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}