import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { signIn } from 'next-auth/react'

const pubAPI = process.env.DIRECTUS_PUBLIC_API

const options = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: 'Email', type: 'text', placeholder: 'Enter your email'},
                password: {label: 'Password', type: 'password', placeholder: 'Enter your password'},
              },
            async authorize(credentials) {
                const payload = {
                    email: credentials.email,
                    password: credentials.password,
                }

                const res = await fetch(`${pubAPI}/auth/login`, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Accept-Language': 'en-US',
                    },
                    credentials: "include"
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
    session: {
        jwt: true
    },
    jwt: {
        secret: process.env.JWT_SECRET,        
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
    
        async session({ session, token }) {
          session.user.accessToken = token.accessToken;
          session.user.refreshToken = token.refreshToken;
    
          return session;
        },
      },
      pages: {
        signIn: "/sign-in",
      }
}

const handler = NextAuth(options)

export { handler as GET, handler as POST }
// export default (req, res) => NextAuth(req, res, options);