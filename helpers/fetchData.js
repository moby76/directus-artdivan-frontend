//утилита для подключения к graphQL-API и получения данных с бэкенда/CMS

const graphQLAPI = process.env.NEXT_PUBLIC_GRAPHQL//адрес до эндпоинта graphql API 

const fetchData = async (query, { variables = {} }) => {
    const headers = { 'Content-Type': 'application/json' }

    const res = await fetch(graphQLAPI, {
        method: 'POST',//NOTE -  Для взаимодействия с данными graphql API используется POST - метод. сначала мы передаём данные на основании которых получим ответ
        headers,
        body: JSON.stringify({//тело запроса преобразованное в строковый формат
            query,//запрос
            variables//переменные
        }),
        cache: 'no-store'  ,
        // next: { revalidate: 5 }
    })

    //получим ответ с сервера ти преобразуем обратно в формат json
    const json = await res.json()

    if (json.errors) {
        throw new Error(json.errors)
    }

    return json
}

export default fetchData