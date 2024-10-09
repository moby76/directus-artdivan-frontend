"use client"

import { useRouter } from "next/navigation";
import MiniCart from "../components/MiniCart";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/queries/Users";

const fetchCurrentUser = async (query, token, { variables = {} }) => //1. graphql-запрос, 2. Токен из сессии(access_token( из Directus)), 3. переменные для запроса
{//запрос, токен, переменные
   const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ token }`//для авторизации передаётся access_token 
   };

   //получить данные по текущему пользователю. Через fetch(?) //FIXME - 
   const res = await fetch('http://localhost:8060/graphql/system', {// /graphql/system -ендпоинт Директуса для взаимодействия с пользователями
      method: 'POST',
      headers,
      body: JSON.stringify({
         query,// getCurrentUser из "@/queries/Users"
         variables,
      }),
   });

const resJson = await res.json();

   if (resJson.errors) {
      throw new Error(resJson.errors);
   }

   return resJson.data.users_me;
};

export default function UserAreaClient (){

  const router = useRouter();//использовать метод useRouter для построения маршрутов 

   const { data: session, status: userStatus, update} = useSession({ required: true });
   
   // console.log(session.user.expires);

   //получить текущего пользователя (users_me) 
   const { data: user, isSuccess } = useQuery({
      queryKey: ['currentUser'], //ключевой идентификатор данного запроса      
      queryFn: async () => await fetchCurrentUser(
         getCurrentUser, //первым параметром будет обращение к graphql-запросу getCurrentUser,
         session.user.accessToken, //вторым - access_token пользователя из сессии(директуса)
         {}//и переменные для запроса{}
      ),                                                                       
      staleTime: Infinity,
      // gcTime: 1000,//FIXME - 
      enabled: userStatus === 'authenticated',//включится только когда статус из сессии = "авторизирован
   })

   console.log('USER_ME', user);

   //реализация входа при истечении refresh_token
//    if(session && session.user.error){
//       console.log('есть ошибка', session.user.error);
//       router.push('/sign-in')
//    } 

    return (
        <section className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
           <h2>
              {/* Hello, <strong>{isSuccess && user.first_name} {isSuccess && user.last_name}</strong> */ }
              Hello <strong>{ isSuccess && `${ user.first_name }  ${ user.last_name }` }</strong>
              { isSuccess && <MiniCart /> }
           </h2>
           <p>This is an authenticated page.</p>

        </section>
     );
}