'use client'

import getData from '@/queries/getData'
import { getSession } from '@/queries/sessions'
import { useQuery, useMutation } from '@tanstack/react-query'
import useStore from '@/store/temp_orders'
import { useEffect } from 'react'

export default function MiniCart()
{
    //получить уже созданный предзаказ текущей сессии(по id сессии) для добавления в него новых данных(товаров или вариаций)

    const { data: session, isSuccess, isLoading, } = useQuery({
        queryKey: ['session'], //
        queryFn: async () =>
            await getData(getSession, 'session_by_id', {
                id: localStorage.getItem('session_id'),
            }),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        // enabled: isSessionSet
    })

    const { tempOrder, setInitialTempOrder } = useStore()

    //загрузим сохранённый предзаказ из @/store/temp_orders для отображения 
    useEffect(() =>
    {
        if (isSuccess && session) {//проверяется запрос useQuery и если получен статус "Успешно" и данные(session), то:
            setInitialTempOrder(session.temp_order)//вернуть состояние setInitialTempOrder с переданными туда значениями полученными с бэкенда.
        }

    }, [isSuccess])


    if (isLoading) {
        return (
            <section className='max-w-2xl mx-auto pt-8 px-4 lg:max-w-7xl lg:px-8'>
                <div>Cart Is loading...</div>
            </section>
        )
    }

    //запросить массив tempOrder из @/store/temp_orders и если его длина = 0 то вернуть сообщение "Ваша корзина пуста"
    if (!useStore.getState().tempOrder.length) {
        return (
            <section className='max-w-2xl mx-auto pt-8 px-4 lg:max-w-7xl lg:px-8'>
                <div>Your cart is empty</div>
            </section>
        )
    }

    return (
        <section className='max-w-2xl mx-auto pt-8 px-4 lg:max-w-7xl lg:px-8'>
            <div>Ваш заказ</div>
            <table className='table-auto'>
                <thead className='bg-gray-100'>
                    <tr>
                        <th className='px-6 py-2 text-xs text-gray-500'>Product name</th>
                        <th className='px-6 py-2 text-xs text-gray-500'>Size</th>
                        <th className='px-6 py-2 text-xs text-gray-500'>Color</th>
                        <th className='px-6 py-2 text-xs text-gray-500'>Qty.</th>
                        <th className='px-6 py-2 text-xs text-gray-500'>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {isSuccess && session.temp_order.map((item) => ( */ }
                    { tempOrder.map((item) => (
                        <tr key={ item.id }>
                            {/* <tr key={uuidv4()}> */ }
                            <td className='px-6 py-2 text-sm text-center text-gray-500'>{ item.product_name }</td>
                            <td className='px-6 py-2 text-sm text-center text-gray-500'>{ item.size_short_title }</td>
                            <td className='px-6 py-2 text-sm text-center text-gray-500'>
                                <span
                                    className='w-4 h-4 rounded-2xl border-white inline-block mt-2'
                                    style={ { background: item.color_value } }
                                ></span>
                            </td>
                            <td className='px-6 py-2 text-sm text-center text-gray-500'>{ item.quantity }</td>
                            <td className='px-6 py-2 text-sm text-center text-gray-500'>{ item.price }</td>
                        </tr>
                    )) }
                </tbody>
            </table>
        </section>
    )
}
