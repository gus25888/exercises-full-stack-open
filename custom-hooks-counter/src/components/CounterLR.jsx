/* eslint-disable react/prop-types */
import useCounter from '../hooks/useCounter'

const CounterLR = () => {
  const left = useCounter()
  const right = useCounter()

  return (
    <div>

      <button onClick={left.increase}>
        left | {left.value}
      </button>
      <button onClick={right.increase}>
        right | {right.value}
      </button>

    </div>
  )
}

export default CounterLR