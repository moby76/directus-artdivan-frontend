import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const pubAPI = process.env.DIRECTUS_PUBLIC_API

const options = {//опции для хендлера NextAuth
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: 'Email', type: 'text', placeholder: 'Enter your email'},
                password: {label: 'Password', type: 'password', placeholder: 'Enter your password'},
                // email: {},
                // password: {},
              },
            async authorize(credentials) {//метод authorize создаст авторизованного пользователя(при условии возможности его входа в систему)
                // const payload = {
                //     email: credentials.email,
                //     password: credentials.password,
                // }

                const res = await fetch(`${pubAPI}/auth/login`, {//REST - запрос для авторизации к ендпоинту Directus 'http://localhost:8060/auth/login'
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
        async jwt({ token, user, trigger, session  }) {
          if (user) {
            return {
              ...token,
              accessToken: user.data.access_token,
              refreshToken: user.data.refresh_token,              
            };
          }

          if (trigger === "update") {
            return { ...token, ...session.user };
          }
    
          return {...token, ...user};
        },

        session: {
          // jwt: true,
          strategy: "jwt",
          maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    
        async session({ session, token }) {
          session.user.accessToken = await token.accessToken;
          session.user.refreshToken = await token.refreshToken;
    
          return session;
        },
      },      
}

const handler = NextAuth(options)

export { handler as GET, handler as POST }
// export default (req, res) => NextAuth(req, res, options);