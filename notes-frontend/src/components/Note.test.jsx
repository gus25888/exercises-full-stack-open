import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'



test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')

  screen.debug(element)

  expect(element).toBeDefined()
})



/* Otra forma de llegar al mismo resultado que arriba: */
/*
test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const { container } = render(<Note note={note} />)
  const div = container.querySelector('.note')
  expect(div).toHaveTextContent('Component testing is done with react-testing-library')
})
*/

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  // Función de vitest para permitir generar una función maqueta (mock)
  const mockHandler = vi.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  // Inicia una sesión de usuario para poder interactuar con el botón
  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  // Las llamadas a mockHandler quedan guardadas en el array "calls" dentro de la propiedad "mock"
  expect(mockHandler.mock.calls).toHaveLength(1)
})