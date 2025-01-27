
const Notification = ({ message }) => (
  <div>
    {
      (message && <div class='success'>{message}</div>)
    }
  </div>
)

export default Notification