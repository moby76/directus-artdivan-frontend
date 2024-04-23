// //утилита для подключения к graphQL-API и отправки данных/мутаций на бэкенд/CMS
// const graphQLAPI = process.env.NEXT_PUBLIC_GRAPHQL//адрес до эндпоинта graphql API 

// const setData = async (mutation, data = {} ) => {
//     // const headers = { 'Content-Type': 'application/json' }
//     const query = JSON.stringify({
//         query: mutation,
//         variables: data
//     })

//     const response = await fetch(graphQLAPI, {
//         method: 'POST',//NOTE -  Для взаимодействия с данными graphql API используется POST - метод. сначала мы передаём данные на основании которых получим ответ
//         // headers,
//         headers: {'content-type': 'application/json'},
//         // body: JSON.stringify({//тело запроса преобразованное в строковый формат
//         //     query: mutation,//отправка мутации
//         //     variables: data//переменные
//         // }),
//         body: query,
//         cache: 'no-store'  ,
//         next: { revalidate: 5 }
//     })

//     //получим ответ с сервера ти преобразуем обратно в формат json
//     // const json = await res.json()
//     const responseJson = await response.json();

//     // if (json.errors) {
//     //     throw new Error(json.errors)
//     // }

//     // return json.data
//     return responseJson.data;
// }

// export default setData

const graphQLAPI = process.env.NEXT_PUBLIC_GRAPHQL

async function setData(mutation, data = {}, additionalPath = '')
{
  const query = JSON.stringify({
    query: mutation,
    variables: data
  });

  const response = await fetch(`${ graphQLAPI }${ additionalPath }`, {
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    body: query,
  });

  const responseJson = await response.json();
  return responseJson.data;
}

export default setData;
