//формирование динамического содержимого - категории, на основании [slug]

import { SingleProductQuery } from "@/queries/SingleProductQueries"; //получим gql-запрос для отправки на сервер
import getData from "@/queries/getData"; //получим шаблон запроса в который подставим данные из --^ SingleProductQueries
import CategoryPageClient from "./CategoryPageClient";

// import { useState } from "react";

// const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

//параметры для запроса динамического адреса попадают на основании названия родительской динамической папки/маршрута [slug]
export const fetchProduct = async (slugValue) => {
    // передать параметры для подстановки в шаблон запроса и получить данные из getData на продукты по переменной slug
    const data = await getData(SingleProductQuery, "products", {
        product_slug: slugValue,
    });
    //вернуть полученные данные, которые пришли из запроса уже преобразованные в json в утилите getData
    return data[0]; // указание [0] извлечёт данные объекта из массива. Иначе вернёт массив data[{....}]
};


//сгенерировать метаданные для хеадера страница
export async function generateMetadata({ params: { slug } }) {
    const product = await fetchProduct(slug);
    return {
        title: `${product.product_name}. ${product.price} руб.`,
        description: `Это страница описания комплекта ${product.product_name}`,
        icons: { icon: ["/favicon.ico"] },
    };
}

export default async function ({ params: { slug } }) {
    //получить данные из запроса fetchProduct отправив туда параметр slug в качестве аргумента
    const product = await fetchProduct(slug);
    
    return (
        // <CategoryPageClient product={product} session={session}/>
        <CategoryPageClient product={product}/>
    )
}
