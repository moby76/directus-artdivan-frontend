//Главная страница

"use client";

import Image from "next/image";
import getData from "@/queries/getData";
import {useQuery} from "@tanstack/react-query";
import ProductCard from "@/app/components/ProductCard";
import Filters from "@/app/components/Filter";
// import {data} from "autoprefixer"
import { useEffect, useState} from "react";
import {HomepageCategoriesQuery, HomepageFilteredProductsQuery, HomepageProductsQuery} from "@/queries/HomepageQueries";

//Функция определяющая вывод списка продуктов в зависимости от переданного для фильтрации значения категорий
async function handleProductFiltering({queryKey}) {//параметр ключа запроса(это массив), реагирующий на запрос, который по умолчанию отправляется в данный метод
    console.log(queryKey);
    const [_] = queryKey//получить всё что находится в этом ключе запрос(массиве)
    if(_.length) { //запустить проверку длинны массива
        return await getData(HomepageFilteredProductsQuery, 'products', {categories: queryKey[0]})//если массив не пустой то активируется запрос на получение отфильтрованных продуктов начиная с первого значения - queryKey[0]
    }
    return await getData(HomepageProductsQuery, 'products')//иначе, если массив пуст, активируем запрос на получение всех продуктов
}

export default function Home() {

    const [selectedCategories, setSelectedCategories] = useState([])


    const {isPending: productsIsPending, data: products, isSuccess: productsSuccess} = useQuery({
        queryFn: handleProductFiltering, queryKey: [selectedCategories],
    });

    //получить категории
    const {data: categories, isSuccess: categoriesSuccess} = useQuery({
        queryKey: ["categories"], //идентификатор запроса для дальнейшего использования его в коде или react query Devtools
        queryFn: async () => await getData(HomepageCategoriesQuery, 'categories'),
        staleTime: Infinity
    });

    //
    const getSelectedCategories = (categoryId) => {
        // console.log(category)
        if(selectedCategories.includes(categoryId)){// если выбранные категории уже включают отмеченный id категории то:
            setSelectedCategories(selectedCategories.filter(item => item !== categoryId))// этот id исключается изз массива выбранных
            return
        }
        setSelectedCategories([...selectedCategories, categoryId])//к уже выбранным id добавляем ещё вновь отмеченные
    }

    // useEffect(() => {
    //     console.log(selectedCategories)
    // },[selectedCategories])

    return (
        
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">

            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Latest Products</h2>
            {categoriesSuccess && <Filters categories={categories} getSelectedCategories={getSelectedCategories}/> }
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {productsIsPending && <h1>Loading products</h1>}
                {productsSuccess && products.map(product => <ProductCard
                    product_name={product.product_name}
                    price={product.price} key={product.id}
                    image={product.product_image.id}
                    // category={product.category[0].categories_id.category_name}
                    category={product.category[0].categories_id}
                    slug={product.slug}
                />)}
            </div>
        </div>
    )
}
