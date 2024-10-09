'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import setData from '@/helpers/setData'
import getData from '@/queries/getData'
import { v4 as uuidv4 } from 'uuid'
import useStore from '@/store/temp_orders'
import { createPreorder, getPreorder, updatePreorder } from '@/queries/preorders'

const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL

export default function CategoryPageClient({ product, session })
{
    // console.log(product);
    const queryClient = useQueryClient()//получить запросы из кэша useQuery

    //получить поля из продукта
    const {
        id,
        slug: product_slug,
        product_name,
        category,
        price,
        show_colors,
        available_colors,
        product_image,
        show_sizes,
        available_sizes,
    } = product

    //установить начальные значения для цветов и размеров
    const [colorValue, setColorValue] = useState(null) //значение colorId будет изменяться при нажатии чекбокса выбора цвета
    const [sizeShortTitle, setSizeShortTitle] = useState(null)
    //id сессии не должно меняться при повторных отправках данных. Для отслеживания сессии создать состояние проверяющее localStorage браузера
    const [isPreorderSet, setPreorder] = useState(
        //FIXME - при открытии продукта в новом окне или перезагрузке текущего окна браузера сессия перезаписывается, хотя остаётся тот-же сеанс
        typeof window !== 'undefined' && localStorage.getItem('preorder_id') !== null //
    )

    //получить уже созданный предзаказ текущей сессии(по id сессии) для добавления в него новых данных(товаров или вариаций)
    // const { data: session, isSuccess } = useQuery({
    //     queryKey: ['session'], //ключевой идентификатор данного запроса
    //     queryFn: async () =>
    //         await getData(getSession, 'session_by_id', { id: localStorage.getItem('preorder_id') }),
    //     staleTime: Infinity,// refetchOnWindowFocus: false,
    //     enabled: isPreorderSet, // enabled: isPreorderSet, //enabled: isPreorderSet - пометка для "react query devtools"
    // })

    //получить уже созданный предзаказ (по id сессии) для добавления в него новых данных(товаров или вариаций)
    const { data: preorder, isSuccess } = useQuery({
        queryKey: ['preorder'], //ключевой идентификатор данного запроса
        queryFn: async () =>
            await getData(getPreorder, 'preorder_by_id', { id: localStorage.getItem('preorder_id') }),
        staleTime: Infinity,// refetchOnWindowFocus: false,
        enabled: isPreorderSet, // enabled: isPreorderSet, //enabled: isPreorderSet - пометка для "react query devtools"
    })

    //ATTENTION - это состояние должно следовать только после уже запущенного useQuery на получение предзаказа --^
    //задать состояние для предзаказа. первоначальное значение(сначала проверяется - создана-ли сессия, если создана, то получаем уже созданный предзаказ из этой сессии с сервера) иначе назначаем пустой массив вкачестве начального значения
    const [tempOrder, setTempOrder] = useState(preorder?.temp_order || [])

    
    console.log('session=', session);
    //активируем запрос для обработки мутации для создания сессии. импортируем подключение setData для передачи мутаций и передадим в него запрос createSession(из @/queries/sessions) на создание сессии, с передачей внагрузку данные
    const { mutate: createNewPreorder } = useMutation({//присвоить параметру mutate имя createNewPreorder для дальнейшего использования
        mutationFn: (newPreorder) =>{
            if (!isPreorderSet) {
                //если сессия не установлена то выполнить запрос на создание сессии
                setData(createPreorder, { data: newPreorder }) //использовать запрос для отправки на сервер setData и передать в него мутацию createSession с данными
                    .then((response) =>{//потом 
                        localStorage.setItem(//передать значения в localStorage:
                            'preorder_id', //ключь
                            response.create_preorder_item.id //значение id сессии из запроса к graphql-инпуту: input create_session_input
                        )
                    })
                setPreorder(true) //так-же установить значение для isPreorderSet в булевое true
            } else {
                //иначе(если сессия уже создана) нужно обновить только данные по id сессии
                setData(updatePreorder, {
                    //обратиться к запросу на обновление сессии updateSession и передать в него:
                    data: newPreorder, //данные (status + массив temp_order)
                    id: localStorage.getItem('preorder_id'),
                }) //использовать запрос для отправки на сервер setData и передать в него мутацию updateSession с данными и id текущей сессии из localStorage браузера
            }
        },
        onSuccess: () => {//onSuccess(функция метода useMutation): при успешной отработке функции внутри mutationFn:
            queryClient.invalidateQueries({ queryKey: ['preorder'] })//Делать недействительным все запросы по ключю('preorder'). из useQuery (https://tanstack.com/query/latest/docs/reference/QueryClient/#queryclientinvalidatequeries)
        },
    })

    const { addToTempOrder } = useStore()

    //установить состояние кнопки Add to Cart в зависимости от того - товар уже добавлен или нет
    // const [buttonDisabled, setButtonDisabled] = useState(false)

    //метод который сработает по нажатию на кнопку Add to Card. Добавит данные в предзаказ
    const addToCart = () =>
    {
        // //назначить переменную которая будет = либо значению temp_order из сессии, либо, если ничего не создано - то пустому массиву
        // let temp_order = tempOrder;

        //добавить значения в массив

        addToTempOrder({
            product_id: id,
            product_name: product_name,
            price: price,

            quantity: '1',

            color_value: colorValue,
            size_short_title: sizeShortTitle,
            id: uuidv4(),
        })

        // temp_order.push({
        //     product_id: id,
        //     product_name: product_name,
        //     price: price,

        //     quantity: '1',

        //     color_value: colorValue,
        //     size_short_title: sizeShortTitle,
        //     id: uuidv4(),
        // });

        //создание новой сессии мутацией хука useMutation - mutate: createNewPreorder --^
        createNewPreorder({//передать данные в мутацию mutate: createNewPreorder при создании нового предзаказа
            
            status: 'draft', //статус сессии "черновик"
            temp_order: useStore.getState().tempOrder, //массив значений полей временного заказа
        })

        //и установить состояние для кнопки в неактивное
        // setButtonDisabled(true)
    }

    return (
        <section className='max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
            {/* <h1>Это страница продукта {product_name}, по цене {price}</h1> */ }
            <div className='md:flex'>
                <div className=''>
                    <img
                        className='w-full object-center object-cover group-hover:opacity-75'
                        src={ `${ assetsUrl }/${ product_image.id }?width=385&height=385` }
                    />
                </div>
                <div className='mt-2 md:ml-4'>
                    <h2 className='text-2xl font-extrabold tracking-tight text-gray-900 '>{ product_name }</h2>

                    {/* если поле show_colors имеет параметр true то показываем доступные цвета available_colors */ }
                    { show_colors && (
                        <div className='mt-4'>
                            <p className='mb-4 font-bold'>Choose a color</p>
                            <div className='flex'>
                                { available_colors.map((color) => (
                                    <div key={ color.product_colors_id.id }>
                                        <label className='inline-flex items-center cursor-pointer'>
                                            <input
                                                type='radio'
                                                value={ color.product_colors_id.color_value }//получить значение цвета из продукта
                                                className='absolute opacity-0 h-0 w-0 peer'
                                                name='colors'
                                                onChange={ (e) => {//при изменении 
                                                    setColorValue(e.target.value)//установить 
                                                } } //при изменении инпута для colorId будет присвоено значение: color.product_colors_id.id
                                            />
                                            <span
                                                className='w-8 h-8 peer-checked:shadow-[0_0_0_2px_rgba(204,204,204)] rounded-2xl mr-2 border-white border-2'
                                                style={ {
                                                    background: color.product_colors_id.color_value,
                                                } }
                                            ></span>
                                        </label>
                                    </div>
                                )) }
                            </div>
                        </div>
                    ) }

                    {/* если поле show_sizes имеет параметр true то показываем доступные размеры available_sizes */ }
                    { show_sizes && (
                        <div className='mt-4'>
                            <p className='mb-4 font-bold'>Choose a size</p>
                            <div className='flex'>
                                { available_sizes.map((size) => (
                                    <div key={ size.product_sizes_id.id }>
                                        <label className='inline-flex items-center cursor-pointer'>
                                            <input
                                                type='radio'
                                                value={ size.product_sizes_id.short_title }
                                                className='mr-2 absolute opacity-0 h-0 w-0 peer'
                                                name='sizes'
                                                onChange={ (e) =>
                                                {
                                                    setSizeShortTitle(e.target.value)
                                                } } //при изменении инпута для sizeId будет присвоено значение: size.product_sizes_id.id
                                            />
                                            <span className='w-8 h-8 peer-checked:bg-black peer-checked:text-white peer-checked:border-black rounded mr-2 border-gray-300 border-2 flex items-center justify-center'>
                                                { size.product_sizes_id.short_title }
                                            </span>
                                        </label>
                                    </div>
                                )) }
                            </div>
                        </div>
                    ) }
                    <button
                        className='mt-8 bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-700'
                        //при нажатии на кнопку запустит нашу мутацию mutation
                        onClick={ () => addToCart() } //при нажатии запустит метод addToCart
                    // disabled={buttonDisabled}//атрибут disabled Блокирует доступ к кнопке и её изменение
                    >
                        Add to cart
                    </button>
                </div>
            </div>
        </section>
    )
}
