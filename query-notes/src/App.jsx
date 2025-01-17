import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { createNote, getNotes, updateNote } from './requests'

const App = () => {
  const queryClient = useQueryClient()

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    /*
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
    */
    onSuccess: (modifiedNote) => {
      console.log(modifiedNote)

      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.map((note) => (note.id === modifiedNote.id) ? modifiedNote : note))

    }
  })

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    /*
      Este método obliga a la app a obtener nuevamente los datos, generando una nueva llamada GET.

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notes'] })
        }

      Lo que se puede hacer es modificar el estado de los datos directamente para evitar la nueva llamada.
    */
    onSuccess: (newNote) => {
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.concat(newNote))
    }
  })

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ content, important: true })
  }

  const toggleImportance = (note) => {
    updateNoteMutation.mutate({ ...note, important: !note.important })
  }

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    // Con esta opción se indica que NO se realice una recarga de los datos al seleccionar algún input.
    refetchOnWindowFocus: false
  })

  // console.log(JSON.parse(JSON.stringify(result)))

  // Una de las posibles consultas a realizar al estado de result, que se relaciona con los estados de una promesa.
  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const notes = result.data

  return (
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map(note =>
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content}
          <strong> {note.important ? 'important' : ''}</strong>
        </li>
      )}
    </div>
  )
}

export default App