import { create } from 'zustand'

const initStates = {
    todos: [],
    refreshTodos: () => {},
}
const useTodosStore = create((set) => ({
    ...initStates,
    setTodos: (todos) => set({ todos }),
    setRefreshTodos: (refreshTodos) => set({ refreshTodos }),
}))

export const useTodos = () => useTodosStore((state) => state.todos)
export const useRefreshTodos = () => useTodosStore((state) => state.refreshTodos)
export const useSetTodos = () => useTodosStore((state) => state.setTodos)
export const useSetRefreshTodos = () => useTodosStore((state) => state.setRefreshTodos)