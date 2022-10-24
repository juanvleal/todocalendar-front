import api from "../api/api";

export async function getAllTodos() {
    const response = await api.get('/todo');
    return response.data;
}

export async function createTodos(data) {
    const response = await api.post("/todo/", data);
    return response;
}

export async function updateTodos(id, data) {
    const response = await api.put(`/todo/${id}/`, data);
    return response;
}

export async function deleteTodos(id) {
    const response = await api.delete(`/todo/${id}/`);
    return response;
}
