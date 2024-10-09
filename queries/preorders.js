
//Запрос на создание предзаказа с отправкой первоначальных данных
export const createPreorder = `#graphql
mutation CreatPreorderItem ($data: create_preorder_input!){
    create_preorder_item(data: $data) {
        id
    }
}
`

//запрос на обновление данных текущего предзаказа по id 
export const updatePreorder = `#graphql
mutation UpdatePreorderItem($data: update_preorder_input!, $id: ID!) {
    update_preorder_item(data: $data, id: $id){
        id
    }
}
`

//запрос на получение данных из предзаказа
export const getPreorder = `#graphql
    query getPreorderItem($id: ID!){
        preorder_by_id(id: $id){
            id
            temp_order
            order_customer
        }
    }
`