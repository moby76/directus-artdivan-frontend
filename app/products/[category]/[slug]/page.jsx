//формирование динамического содержимого - продуктов, на основании [slug]
import { SingleProductQuery } from "@/queries/SingleProductQueries";//получим gql-запрос для отправки на сервер
import getData from "@/queries/getData";//получим шаблон запроса в который подставим данные из --^ SingleProductQueries

const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL

//параметры для запроса динамического адреса попадают на основании названия родительской динамической папки/маршрута [slug]
export const fetchProduct = async (value) => {

    // передать параметры для подстановки в шаблон запроса и получить данные из getData на продукты по переменной slug
    const data = await getData(SingleProductQuery, 'products', {product_slug: value });
    //вернуть полученные данные, которые пришли из запроса уже преобразованные в json в утилите getData
    return  data[0]// указание [0] извлечёт данные объекта из массива. Иначе вернёт массив data[{....}]   
};

//сгенерировать метаданные для хеадера страница
export async function generateMetadata ({ params: { slug } }) {
    const product = await fetchProduct(slug)
    return{
        title: `${product.product_name}. ${product.price} руб.`,
        description: `Это страница описания комплекта ${product.product_name}`,
        icons: {icon: ['/favicon.ico']}
    }
}

export default async function ProductPage({ params: { slug } }) {

    //получить данные из запроса fetchProduct отправив туда параметр slug в качестве аргумента 
    const product = await fetchProduct(slug)

    const { slug: product_slug, product_name, category, price } = product

    // console.log(product_slug);

    return (
        <section className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            {/* <h1>Это страница продукта {product_name}, по цене {price}</h1> */}
            <div className="md:flex">
                <div className="">
                    <img className="w-full object-center object-cover group-hover:opacity-75" src={`${assetsUrl}/${product.product_image.id}?width=385&height=385`} />
                </div>
                <div className="mt-2 md:ml-4">
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 ">{product.product_name}</h2>
                </div>
            </div>
        </section>
    );
}


