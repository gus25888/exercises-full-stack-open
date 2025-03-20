import { useState } from 'react'
import { useQuery, useApolloClient } from '@apollo/client'

import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PhoneForm from './components/PhoneForm'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'

import { ALL_PERSONS } from './queries'

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient()

  if (result.loading) {
    return <div>loading...</div>
  }
  if (result.error) {
    console.log(result.error)

    return <div>Error detected... Review console.</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 2000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={notify} />
      </>
    )
  }

  return (
    <>
      <Notify errorMessage={errorMessage} />
      <button onClick={logout}>logout</button>
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </>
  )
}
export default App
