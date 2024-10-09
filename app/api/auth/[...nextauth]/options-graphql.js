// 'use client'

//------------SECTION-----------
//
// описание: https://docs.directus.io/blog/directus-auth-nextauth.html
//
//------------SECTION----------- - 

import { data } from 'autoprefixer';
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { signIn } from 'next-auth/react';

const pubAPI = process.env.DIRECTUS_PUBLIC_API

export const authOptions = {//опции для хендлера NextAuth
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: 'Email', type: 'text', placeholder: 'Enter your email'},
                password: {label: 'Password', type: 'password', placeholder: 'Enter your password'},
                // email: {},
                // password: {},
              },

            //метод authorize создаст авторизованного пользователя(при условии возможности его входа в систему)
            async authorize(credentials) {

              console.log('РЕКВИЗИТЫ ДЛЯ ВХОДА',credentials);

              //создать graphql-запрос/мутацию
              const query = `#graphql
                 mutation ($email: String!, $password: String!) {
                          auth_login(email: $email, password: $password) {
                            expires
                            access_token
                            refresh_token
                          }
                      }
              `

              const variables = { 
                email: credentials.email,
                password: credentials.password
              }

              const body = JSON.stringify({ query, variables })

                //REST - запрос для авторизации к ендпоинту Directus 'http://localhost:8060/auth/login'
                //GraphQL - запрос для авторизации к ендпоинту Directus 'http://localhost:8060/graphql/system'
                const res = await fetch(`${pubAPI}/graphql/system`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: body,                    
                    credentials: "include",//включая credentials
                })
                
                //присвоить полученный результату переменную "user" в формате json
                const user = await res.json(data)
                
                console.log(user)

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

    jwt: {
      // The maximum age of the NextAuth.js issued JWT in seconds.
      // Defaults to `session.maxAge`.
      maxAge: 60 * 60 * 24 * 30,
      // secret: process.env.JWT_SECRET
      // You can define your own encode/decode functions for signing and encryption
      // async encode() {},
      // async decode() {},
    },

    // debug: true,

    session: {//опции для функции session
      // jwt: true,
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    callbacks: {//обратные вызовы в next-auth — это функции после успешной аутентификации

        // FUNCTION  - функция async jwt присоединяет access_token и refresh_token из ответа на запрос к http://localhost:8060/auth/login к сгенерированному токену JWT.
        //Функция также извлекает пользовательские данные из Directus с помощью access_token и присоединяет данные к токену JWT.
        async jwt({ token, user, account, trigger, session  }) {// user - aka --^ (user = res.json())
          if (account && user) {//если создан аккаунт и получен user --^
            
            
            //TODO - реализовать!
            //------------SECTION----------- - 
            // const userData = await directus.request(
            //   withToken(
            //     user.data.access_token,
            //     readMe({
            //       fields: ['id', 'first_name', 'last_name'],
            //     })
            //   )
            // )
            //------------SECTION----------- - 
            
            return {//вернуть:
              ...token, //токен 
              accessToken: user.data.auth_login.access_token,//создать значение accessToken на основе токена доступа из данных полученных в ответ на запрос 
              expires: Date.now() + Number(user.data.auth_login.expires),
              refreshToken: user.data.auth_login.refresh_token,       
              error: user.error,
            };
          }

          if (Date.now() < token.expires) {
            console.log("Время access_token ещё не вышло");
            return token;            
          }
          // if (trigger === "update") {
          //   return { ...token, ...session.user };
          // }
    
          // return {...token, ...user};
          // return token
          
          console.log("Время access_token истекло");
          const refreshed = await refreshAccessToken(token);          
          return await refreshed;
        },        

        // FUNCTION  - Функция асинхронного сеанса присоединяет пользовательские поля к объекту session.user, которые содержат идентификатор, имя и фамилию, а также accessToken иrefreToken, полученные из Directus.
        async session({ session, token }) {
          session.user.accessToken = await token.accessToken;// присоединить к объекту session.user токен доступа из token --^
          session.user.refreshToken = await token.refreshToken;// присоединить к объекту session.user токен обновления из token --^
          session.user.expires = token.expires;
          session.user.error = token.error;
          
          return session;
        },
      },      
}

async function refreshAccessToken(token) {

  const query = `#graphql
    mutation AuthRefresh ($refresh_token: String!){
            auth_refresh(refresh_token: $refresh_token) {
              expires
              access_token
              refresh_token
            }
        }
    `
    const variables = { 
      refresh_token: token.refreshToken,
      // mode: session
    }

    const body = JSON.stringify({ query, variables })

  try {    
    const response = await fetch(`${pubAPI}/graphql/system`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: body,
      credentials: "include",
    });
    
    const refreshedTokens = await response.json();
    console.log('RESPONSE', refreshedTokens);

    if (!response.ok) {
      signIn();
    }

    if (response.ok && refreshedTokens) {
      return {
        ...token,
        accessToken: refreshedTokens.data.auth_refresh.access_token,
        expires: Date.now() + Number(refreshedTokens.data.auth_refresh.expires),
        refreshToken: refreshedTokens.data.auth_refresh.refresh_token,
      };     
    }
  } catch (error) {
    console.log( new Date() + "Error in refreshAccessToken:", error.message )

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// const handler = NextAuth(options)

// export { handler as GET, handler as POST }
// export default (req, res) => NextAuth(req, res, options);