// 'use client'

//------------SECTION-----------
//
// описание: https://docs.directus.io/blog/directus-auth-nextauth.html
//
//------------SECTION----------- - 

import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { signIn } from 'next-auth/react'

const pubAPI = process.env.DIRECTUS_PUBLIC_API

export const options = {//опции для хендлера NextAuth
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
                               
                //REST - запрос для авторизации к ендпоинту Directus 'http://localhost:8060/auth/login'
                const res = await fetch(`${pubAPI}/auth/login`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),//в тело запроса попадают реквизиты для входа (credentials): email, password --^
                    headers: { 'Content-Type': 'application/json'},
                    credentials: "include",//включая credentials
                })

                //присвоить полученный результату переменную "user" в формате json
                const user = await res.json()
                console.log(user);

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
      // You can define your own encode/decode functions for signing and encryption
      // async encode() {},
      // async decode() {},
    },

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
              accessToken: user.data.access_token,//создать значение accessToken на основе токена доступа из данных полученных в ответ на запрос 
              expires: Date.now() + user.data.expires,
              refreshToken: user.data.refresh_token,  
              error: user.data.error,            
            };
          }

          // if (trigger === "update") {
          //   return { ...token, ...session.user };
          // }
    
          // return {...token, ...user};
          // return token

          if (Date.now() < token.expires) {
            console.log("Время ещё не вышло из REST options");
            return token;
          }

          console.log("Время истекло из REST options");
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
  try {
    const response = await fetch(`${pubAPI}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
      credentials: "include",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      signIn();
    }

    if (response.ok && refreshedTokens) {
      return {
        ...token,
        accessToken: refreshedTokens.data.access_token,
        expires: Date.now() + refreshedTokens.data.expires,
        refreshToken: refreshedTokens.data.refresh_token,
      };
    }
  } catch (error) {
    console.log(
      new Date().toUTCString() + " Error in refreshAccessToken:",
      error
    );
    signIn()
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
    
  }
}
