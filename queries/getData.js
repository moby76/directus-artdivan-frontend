// утилита-шаблон для получения данных из graphql-запросов из graphql-API.

import fetchData from "@/helpers/fetchData";//импортируем утилиту подключения к API 


// import {
//     HomepageCategoriesQuery,
//     HomepageFilteredProductsQuery,
//     HomepagePostsQuery,
//     HomepageProductsQuery
// } from "./HomepageQueries";

// export const getHomepagePosts = async () => {
//     const data = await fetchData(
//         HomepagePostsQuery,
//         {
//             variables: {},
//         }
//     );
//     return data.data.posts
// };
//
// //экспортируем запрос на продукты во вне
// export const getHomepageProducts = async () => {
//     const data = await fetchData(
//         HomepageProductsQuery,
//         {
//             variables: {},
//         }
//     );
//     return data.data.products
// };
//
// //экспортируем запрос на категории во вне
// export const getHomepageCategories = async () => {
//     const data = await fetchData(
//         HomepageCategoriesQuery,
//         {
//             variables: {},
//         }
//     );
//     return data.data.categories
// };
//
// //экспортируем запрос на пустой массив категорий(все категории) во вне
// export const getHomepageFilteredProducts = async (categories) => {
//     const data = await fetchData(
//         HomepageFilteredProductsQuery,
//         {
//             variables: {
//                 categories
//             }
//         }
//     )
//     return data.data.products
// }

//один общий метод для всех --^ запросов

// Шаблон для составления запросов: (Запрос,  )
const getData = async(query, dataName, variables = {}) => {
    const data = await fetchData(
        query,//передать запрос для отправления
        {
            variables//передать переменные
        }
    )

    return data.data[dataName]//вернёт, например data.products[{....}, {....}, {....}]
}

export default getData