'use client'

import { useRouter } from "next/navigation";
import { useQuery } from '@tanstack/react-query'
import { useSession } from "next-auth/react";
import { getCurrentUser } from "@/queries/Users";
import MiniCart from "../components/MiniCart";

const fetchData = async (query, token, { variables = {} }) => //1. graphql-запрос, 2. Токен из сессии(access_token( из Directus)), 3. переменные для запроса
{//запрос, токен, переменные
   const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ token }`,//NOTE - в авторизацию 
   };

   //получить данные по текущему пользователю. Через fetch(?) //FIXME - 
   const res = await fetch('http://localhost:8060/graphql/system', {
      method: 'POST',
      headers,
      body: JSON.stringify({
         query,
         variables,
      }),
   });

   const json = await res.json();

   if (json.errors) {
      throw new Error(json.errors);
   }

   return json.data.users_me;
};

function UserArea() {

   const router = useRouter();//использовать метод useRouter для построения маршрутов 

   const { data: session, status, update } = useSession({//получить данные и статус пользователя из сессии ипользуя хук useSession
      required: true,//для получения доступа к этой странице обязателен для заполнения
      onUnauthenticated()
      {//если пользователь из сессии не аутентифицирован, то:
         router.push('/sign-in');//перенаправить его на страницу аутентификации
      },

   });

 

   //получить текущего пользователя
   const { data: user, isSuccess } = useQuery({
      queryKey: ['currentUser'], //ключевой идентификатор данного запроса
      //
      queryFn: async () => await fetchData(getCurrentUser, session.user.accessToken, {}),//первым параметром будет обращение к graphql-запросу, 
                                                                                          //вторым - access_token пользователя из сессии(формируется на бэкенде(Directus)) и имеет ограниченный срок действия обозначенный в .env - файле Директуса
                                                                                          //и переменные для запроса{}
      staleTime: Infinity,
      // gcTime: 1000,//FIXME - 
      enabled: status === 'authenticated',//включится только когда статус из сессии = "авторизирован
   })

     async function updateSession () {
      // if(session) session.user.accessToken="ddd"
      await update({
         ...session,
         user:{
            ...session?.user,
            accessToken: session.user.accessToken
         }
      })
   }

   if (status !== 'authenticated') return null;//если пользователь не авторизирован, то вернуть пустую страницу

   return (
      <section className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
         <h2>
            {/* Hello, <strong>{isSuccess && user.first_name} {isSuccess && user.last_name}</strong> */ }
            Hello <strong>{ isSuccess && `${ user.first_name }  ${ user.last_name }` }</strong>
            { isSuccess && <MiniCart /> }
         </h2>
         <p>This is an authenticated page.</p>
         <button className="border bg-violet-600 text-white rounded px-4 py-2" onClick={ updateSession }>
            Update session
         </button>
         <button className="border bg-violet-600 text-white rounded px-4 py-2" onClick={ () => console.log({ session }) }>
            Log session
         </button>
      </section>
   );
}

export default UserArea;