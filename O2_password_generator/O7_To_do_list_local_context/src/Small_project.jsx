import React, { useState } from 'react'
import './Small_project.css'
function Small_project() {

    const [name,setname]=useState('Radha');
    const [msg,setmsg]=useState('hi');

    function handlesubmit(e){
        e.preventDefault()
        setTimeout(() => {
            alert(`sent a ${msg} to ${name}`);
        }, 100);
    }

return (
    <div className='form-container'>
    <form onSubmit={handlesubmit} className='msg-form'>
        <h3>Send a message by sam</h3>
        <div className="input-group">
        <label>TO:</label>
        <select
            value={name}
            onChange={(e)=>setname(e.target.value)}
            className='custom-select'
            >
                <option value="Radha">Radha</option>
                <option value="Sonu">Sonu</option>
            </select>
        </div>
            <textarea 
            placeholder='type here mad man'
            value={msg}
            onChange={(e)=>setmsg(e.target.value)}
            className='custom-textarea'
            >
            </textarea>
            <button type='submit' className='submit-btn'> 
                send message</button>
    </form>
    </div>
)
}

export default Small_project