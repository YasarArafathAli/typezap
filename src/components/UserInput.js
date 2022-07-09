import React, {useState} from 'react'

function UserInput() {
    const [input, setInput] = useState('');
  return (
    <div>
    <p>{input}</p>
    <input type="text" value={input} onChange={(e) => setInput(e.target.value)}/>
    </div>
  )
}

export default UserInput