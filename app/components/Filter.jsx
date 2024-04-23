import Checkbox from "@/app/components/Checkbox";

export default function Filters({categories, getSelectedCategories}) {//из Home получаем в пропсы: "все категории" и "выбранные категории"
    return (
        <div className="flex items-center mt-5">
            {categories.map(category => <Checkbox
                key={category.id}
                label={category.category_name}
                id={category.id}//передаём в компонент Чекбоксы id категории
                getSelectedCategories={getSelectedCategories}//передаём в компонент Чекбоксы выбранные категории
            />)}
        </div>
    )
}