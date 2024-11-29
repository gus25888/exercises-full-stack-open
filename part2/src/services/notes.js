import axios from 'axios'
/*
Este módulo permite la gestión del CRUD (sin delete por ahora) de las notes

Se considera devolver solo la data de la response obtenida dentro de cada función.
*/

const baseUrl = '/api/notes'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

export default {
    getAll,
    create,
    update
}