import ReactDOM from 'react-dom/client'

import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

/*
* Obtención de notas en duro.
const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
]
ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)
*/