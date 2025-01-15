import { createSlice } from "@reduxjs/toolkit"
import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    toggleImportanceOf(state, action) {
      const changedNote = action.payload
      return state.map(note => note.id !== changedNote.id ? note : changedNote)
    },
    appendNote(state, action) {
      state.push(action.payload)
    },
    setNotes(state, action) {
      return action.payload
    }
  },
})



// Considerando que ahora el valor viene desde el backend, la nota vendrá con todos sus valores listos, solo hay que agregarla al state.
// Esto se hace con una función asíncrona, se espera el resultado y luego se agrega al store, usando las propiedades de Redux Thunk.

export const initializeNotes = () => {
  return async (dispatch) => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

export const createNote = (content) => {
  return async (dispatch) => {
    const newNote = await noteService.createNew(content)
    dispatch(appendNote(newNote))
  }
}

export const updateNote = (note) => {
  return async (dispatch) => {
    const noteUpdated = await noteService.updateData(note, note.id)
    dispatch(toggleImportanceOf(noteUpdated))
  }
}

export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions
export default noteSlice.reducer