'use client'

import getData from '@/queries/getData'
import { useQuery, useMutation } from '@tanstack/react-query'
import useStore from '@/store/temp_orders'
import { useEffect } from 'react'
import { getPreorder } from '@/queries/preorders'

export default function MiniCart()
{
    //получить уже созданный предзаказ текущей сессии(по id сессии) для добавления в него новых данных(товаров или вариаций)

    const { data: preorder, isSuccess, isLoading, } = useQuery({
        queryKey: ['preorder'], //
        queryFn: async () =>
            await getData(getPreorder, 'preorder_by_id', {
                id: localStorage.getItem('preorder_id'),
            }),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        // enabled: isSessionSet
    })

    const { tempOrder, setInitialTempOrder } = useStore()

    //загрузим сохранённый предзаказ из @/store/temp_orders для отображения 
    useEffect(() =>
    {
        if (isSuccess && preorder) {//проверяется запрос useQuery и если получен статус "Успешно" и получены данные(preorder), то:
            setInitialTempOrder(preorder.temp_order)//присвоить стейту tempOrder значение поля temp_order из данных ответа на запроса getPreorder
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

    // console.log('Заказчик', preorder.order_customer[0]);

    return (
        <section className='max-w-2xl mx-auto pt-8 px-4 lg:max-w-7xl lg:px-8'>
            <div>Заказчик: {preorder.order_customer[0].first_name} {preorder.order_customer[0].last_name}</div>
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
