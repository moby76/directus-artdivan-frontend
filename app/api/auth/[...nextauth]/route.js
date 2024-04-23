import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { signIn } from 'next-auth/react'
import { stringify } from 'postcss'

const pubAPI = process.env.DIRECTUS_PUBLIC_API

const options = {
    
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                // email: {label: 'Email', type: 'text', placeholder: 'Enter your email'},
                // password: {label: 'Password', type: 'password', placeholder: 'Enter your password'},
                email: {},
                password: {},
              },
            async authorize(credentials) {
                // const payload = {
                //     email: credentials.email,
                //     password: credentials.password,
                // }

                const res = await fetch(`${pubAPI}/auth/login`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { 'Content-Type': 'application/json'},
                    credentials: "include",                    
                })

                const user = await res.json()

                if (!res.ok) {
                    throw new Error('Wrong username or password')
                }

                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user
                }
                // Return null if user data could not be retrieved
                return null
            },
        }),        
    ],

    secret: process.env.NEXTAUTH_SECRET,

    pages: {
      signIn: "/sign-in",
    },

    callbacks: {
        async jwt({ token, user, account }) {
          if (account && user) {
            return {
              ...token,
              accessToken: user.data.access_token,
              refreshToken: user.data.refresh_token,
              
            };
          }
    
          return token;
        },

        session: {
          // jwt: true,
          strategy: "jwt",
          maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    
        async session({ session, token }) {
          session.user.accessToken = token.accessToken;
          session.user.refreshToken = token.refreshToken;
    
          return session;
        },
      },      
}

const handler = NextAuth(options)

export { handler as GET, handler as POST }
// export default (req, res) => NextAuth(req, res, options);