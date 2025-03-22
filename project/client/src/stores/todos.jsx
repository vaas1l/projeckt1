import { create } from 'zustand'

const initStates = {
    todos: [],
    refreshTodos: () => {},
    user: null
}
const useTodosStore = create((set) => ({
    ...initStates,
    setTodos: (todos) => set({ todos }),
    setRefreshTodos: (refreshTodos) => set({ refreshTodos }),
    setUser: (user) => set({ user })
}))

export const useTodos = () => useTodosStore((state) => state.todos)
export const useRefreshTodos = () => useTodosStore((state) => state.refreshTodos)
export const useSetTodos = () => useTodosStore((state) => state.setTodos)
export const useSetRefreshTodos = () => useTodosStore((state) => state.setRefreshTodos)
export const useUser = () => useTodosStore((state) => state.user)
export const useSetUser = () => useTodosStore((state) => state.setUser)