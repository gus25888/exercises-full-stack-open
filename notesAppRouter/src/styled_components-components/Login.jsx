import { useNavigate } from "react-router-dom"
import { Button, Input } from './styles'

const Login = ({ onLogin }) => {
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    onLogin('mluukkai')
    navigate('/')
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>username</label>
          <Input label='username' type="text" />
        </div>
        <div>
          <label>password</label>
          <Input label='password' type="password" />
        </div>
        <Button variant='contained' color="primary" type="submit">login</Button>
      </form>
    </div>
  )
}

export default Login