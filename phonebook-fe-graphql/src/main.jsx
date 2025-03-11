import './App.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'

import './index.css'
import App from './App.jsx'


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000',
  })
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
