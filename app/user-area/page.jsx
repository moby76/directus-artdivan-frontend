'use client'

import { useRouter } from "next/navigation";
import { useQuery } from '@tanstack/react-query'
import { useSession } from "next-auth/react";
import { getCurrentUser } from "@/queries/Users";
import MiniCart from "../components/MiniCart";

const fetchData = async (query, token, { variables = {} }) => {//запрос, токен, переменные
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,//NOTE - 
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

    const { data: session, status } = useSession({//получить данные и статус пользователя из сессии ипользуя хук useSession
      required: true,//для получения доступа к этой странице обязателен для заполнения
      onUnauthenticated() {//если пользователь из сессии не аутентифицирован, то:
        router.push('/sign-in');//перенаправить его на страницу аутентификации
      },
      
    });
  
    // console.log(session);
  
    // const { data: user, isSuccess } = useQuery('currentUser', async () => await fetchData(getCurrentUser, session.user.accessToken, {}), {
    //   enabled: status === 'authenticated',
    // });
  
    const { data: user, isSuccess } = useQuery({
      queryKey: ['currentUser'], //ключевой идентификатор данного запроса
      //
      queryFn: async () => await fetchData(getCurrentUser, session.user.accessToken, {}),//первым параметром будет обращение к graphql-запросу, вторым - JWT-токен пользователя из сессии(формируется коллбэк-функцией в файле api/auth/[...nextauth]/route.js)
      staleTime: Infinity,
      // gcTime: 1000,//FIXME - 
      enabled: status === 'authenticated',//включится только когда статус из сессии = "авторизирован
  })

    if (status !== 'authenticated') return null;//если пользователь не авторизирован, то вернуть пустую страницу
  
    return (
      <section className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2>
          {/* Hello, <strong>{isSuccess && user.first_name} {isSuccess && user.last_name}</strong> */}
          Hello <strong>{ isSuccess && `${user.first_name}  ${user.last_name}` }</strong>
          <MiniCart/>
        </h2>
        <p>This is an authenticated page.</p>
      </section>
    );
  }
  
  export default UserArea;