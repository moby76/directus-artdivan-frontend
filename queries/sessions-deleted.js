
//Запрос на создание сессии с отправкой первоначальных данных
export const createSession = `#graphql
mutation createSessionItem($data: create_session_input!) {
    create_session_item(data: $data){
        id
    }
}
`

//запрос на обновление данных текущей сессии по id 
export const updateSession = `#graphql
mutation updateSessionItem($data: update_session_input!, $id: ID!) {
    update_session_item(data: $data, id: $id){
        id
    }
}
`

//запрос на добавление новых данных, в рамках текущей сессии к тем что уже есть, если был выбран другой товар, или параметры товара(цвет, размер)
export const getSession = `#graphql
    query getSessionItem($id: ID!){
        session_by_id(id: $id){
            id
            temp_order
        }
    }
`