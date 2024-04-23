//чекбоксы лдя фильтрации продуктов по категориям
// id-идентификатор категории, label - название категории
export default function Checkbox({label, id, getSelectedCategories}) {
    return (
        <label className="inline-flex items-center mt-3 mr-3">
            <input type="checkbox" className="h-5 w-5" value={id}
                    // реагирует на изменение значения (onChange) передачей значения {id} в getSelectedCategories
                   onChange={e => getSelectedCategories(+e.target.value)}/>
            <span className="ml-2 text-gray-700">{label}</span>
        </label>
    )
}