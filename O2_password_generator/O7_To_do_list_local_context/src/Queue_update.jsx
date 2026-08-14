import React, { useState } from 'react'

function Queue_update() {
    const[count,setcount]=useState(0);
    function clicked(){
        setcount(count=>count+1)
    }
  return (
    <div>
        <button onClick={clicked}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">+1</button>
        <button
        className="bg-blue-500 text-white  py-2 px-4  mx-2 rounded hover:bg-blue-700 "
        onClick={()=>{
            clicked();
            clicked();
            clicked();
        }}>+3</button>

        <p>current count {count}</p>
        <div></div>
        <button className="bg-black text-white px-6 py-3 rounded"
        onClick={()=>{
            setcount(0);
        }}>reset</button>
    </div>
  )
}

export default Queue_update