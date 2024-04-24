// //утилита для подключения к graphQL-API и отправки данных/мутаций на бэкенд/CMS

const graphQLAPI = process.env.NEXT_PUBLIC_GRAPHQL

async function setData(mutation, data = {}, additionalPath = '') {//название мутации, переменные для мутации, дополнительный адрес(напр. '/system')
  
  const queryForBody = JSON.stringify({
    query: mutation,
    variables: data
  });

  const response = await fetch(`${ graphQLAPI }${ additionalPath }`, {
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    body: queryForBody,//в тело запроса отправится содержимое константы queryForBody
  });

  const responseJson = await response.json();
  return responseJson.data;
}

export default setData;
