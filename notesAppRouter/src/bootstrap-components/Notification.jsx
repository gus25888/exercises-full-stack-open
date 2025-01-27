import Alert from 'react-bootstrap/Alert'


const Notification = ({ message }) => (
  <div>
    {
      (message && <Alert variant='success'>{message}</Alert>)
    }
  </div>
)

export default Notification