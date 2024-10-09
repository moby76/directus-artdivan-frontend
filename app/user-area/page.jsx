// 'use client'
// "use server"
// import { useRouter } from "next/navigation";
import { useQuery } from '@tanstack/react-query'
// import { useSession } from "next-auth/react";
import { getCurrentUser } from "@/queries/Users";
// import MiniCart from "../components/MiniCart";
import { Fragment } from "react";
import UserAreaClient from "./userAreaClient";

// const fetchCurrentUser = async (query, token, { variables = {} }) => //1. graphql-запрос, 2. Токен из сессии(access_token( из Directus)), 3. переменные для запроса
// {//запрос, токен, переменные
//    const headers = {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${ token }`//для авторизации передаётся access_token 
//    };

//    //получить данные по текущему пользователю. Через fetch(?) //FIXME - 
//    const res = await fetch('http://localhost:8060/graphql/system', {// /graphql/system -ендпоинт Директуса для взаимодействия с пользователями
//       method: 'POST',
//       headers,
//       body: JSON.stringify({
//          query,// getCurrentUser из "@/queries/Users"
//          variables,
//       }),
//    });

//    const resJson = await res.json();

//    if (resJson.errors) {
//       throw new Error(resJson.errors);
//    }

//    return resJson.data.users_me;
// };
   
   //реализовать кнопку при истечении access_token ("продолжить"/"выйти")
   //FIXME - 
   //  if (session && session.user.expires < Date.now() + 1000){
   
   //          return (
   //          <Fragment>
   //             <p>Время сессии заканчивается</p>
   //             <button className="border bg-violet-600 text-white rounded px-4 py-2 m-2" onClick={() => update () }>Продолжить</button>
   //          </Fragment>
   //       ) 
   //    }      

export default async function (){

   return (
      <UserAreaClient />
   )
}
  

