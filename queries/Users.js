//запросы для работы с пользователями

//мутация создания нового пользователя
export const createNewUser = `#graphql

mutation createNewUser($data: create_directus_users_input!) {
    create_users_item(data: $data)
}
`

//запрос на получение данных по текущему пользователю
export const getCurrentUser = `#graphql
query {    
    users_me{
        id
        email
        first_name
        last_name
    }
}
`
