//формирование динамического содержимого - продуктов, на основании [slug]

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

    // const { slug: product_slug, product_name, category, price, show_colors, available_colors, product_image, show_sizes, available_sizes } = product;

    // const [colorId, setColorId] = useState(null)
    
    // const [sizeId, setSizeId] = useState(null)

    // console.log(product);

    // return (
    //     <section className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
    //         {/* <h1>Это страница продукта {product_name}, по цене {price}</h1> */}
    //         <div className="md:flex">
    //             <div className="">
    //                 <img
    //                     className="w-full object-center object-cover group-hover:opacity-75"
    //                     src={`${assetsUrl}/${product_image.id}?width=385&height=385`}
    //                 />
    //             </div>
    //             <div className="mt-2 md:ml-4">
    //                 <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 ">
    //                     {product_name}
    //                 </h2>

    //                 {/* если поле show_colors имеет параметр true то показываем доступные цвета available_colors */}
    //                 {show_colors && (
    //                     <div className="mt-4">
    //                         <p className="mb-4 font-bold">Choose a color</p>
    //                         <div className="flex">
    //                             {available_colors.map((color) => (
    //                                 <div key={color.product_colors_id.id}>
    //                                     <label className="inline-flex items-center cursor-pointer">
    //                                         <input
    //                                             type="radio"
    //                                             value={
    //                                                 color.product_colors_id.id
    //                                             }
    //                                             className="absolute opacity-0 h-0 w-0 peer"
    //                                             name="colors"
    //                                         />
    //                                         <span
    //                                             className="w-8 h-8 peer-checked:shadow-[0_0_0_2px_rgba(204,204,204)] rounded-2xl mr-2 border-white border-2"
    //                                             style={{
    //                                                 background:
    //                                                     color.product_colors_id
    //                                                         .color_value,
    //                                             }}
    //                                         ></span>
    //                                     </label>
    //                                 </div>
    //                             ))}
    //                         </div>
    //                     </div>
    //                 )}

    //                 {/* если поле show_sizes имеет параметр true то показываем доступные размеры available_sizes */}
    //                 {show_sizes && (
    //                     <div className="mt-4">
    //                         <p className="mb-4 font-bold">Choose a size</p>
    //                         <div className="flex">
    //                             {available_sizes.map((size) => (
    //                                 <div key={size.product_sizes_id.id}>
    //                                     <label className="inline-flex items-center cursor-pointer">
    //                                         <input
    //                                             type="radio"
    //                                             value={size.product_sizes_id.id}
    //                                             className="mr-2 absolute opacity-0 h-0 w-0 peer"
    //                                             name="sizes"
    //                                         />
    //                                         <span className="w-8 h-8 peer-checked:bg-black peer-checked:text-white peer-checked:border-black rounded mr-2 border-gray-300 border-2 flex items-center justify-center">
    //                                             {
    //                                                 size.product_sizes_id
    //                                                     .short_title
    //                                             }
    //                                         </span>
    //                                     </label>
    //                                 </div>
    //                             ))}
    //                         </div>
    //                     </div>
    //                 )}
    //             </div>
    //         </div>
    //     </section>
    // );

    return (
        <CategoryPageClient product={product}/>
    )
}
