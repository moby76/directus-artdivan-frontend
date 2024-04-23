import { create } from "zustand";

const useStore = create((set) => ({

    tempOrder: [],
    addToTempOrder: (items) => set((state) => ({ tempOrder: [...state.tempOrder, items] })),//добавление во временный заказ
    setInitialTempOrder: (order) => set(() => ({ tempOrder: order })),//установить добавленные товары во временный заказ
}))

export default useStore