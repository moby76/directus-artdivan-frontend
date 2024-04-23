'use client'

import { useRouter } from "next/navigation";
import { useQuery } from '@tanstack/react-query'
import { useSession } from "next-auth/react";


function UserArea() {

    const router = useRouter();//использовать метод useRouter для построения маршрутов 

    const { data: session, status } = useSession({//получить данные и статус пользователя из сессии ипользуя хук useSession
      required: true,//для получения доступа к этой странице обязателен для заполнения
      onUnauthenticated() {//если пользователь из сессии не аутентифицирован, то:
        router.push('/sign-in');//перенаправить его на страницу аутентификации
      },
    });
  
    console.log(session);
  
    // const { data: user, isSuccess } = useQuery('currentUser', async () => await fetchData(getCurrentUser, session.user.accessToken, {}), {
    //   enabled: status === 'authenticated',
    // });
  
    if (status !== 'authenticated') return null;//если пользователь не авторизирован, то вернуть пустую страницу
  
    return (
      <section className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2>
          {/* Hello, <strong>{isSuccess && user.first_name} {isSuccess && user.last_name}</strong> */}
          Hello <strong>USER</strong>
        </h2>
        <p>This is an authenticated page.</p>
      </section>
    );
  }
  
  export default UserArea;