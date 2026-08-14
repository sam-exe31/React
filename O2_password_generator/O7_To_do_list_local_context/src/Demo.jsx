import React from 'react'
import { sculptureList } from './data';
import { useState } from 'react'

export default function Demo() {

    const buttonStyle = {
    backgroundColor: '#4CAF50', // Green
    };
    const [index,setindex]=useState(0); 
    const [showmore,setshowmore]=useState(false);
    const hasnext=index<sculptureList.length-1;

    let sculpture=sculptureList[index];

    function nextclick(){
        if(hasnext){
            setindex(index+1);
        }
        else{
            setindex(0);
        }
    }


    

    function handlemore(){
        setshowmore(!showmore);
    }


return (
    <>
    <button style={buttonStyle} 
    onClick={nextclick}>
        next
    </button>
    <h2>
        <i>{sculpture.name}</i>
        by {sculpture.artist}
    </h2>
    <h3>
        ({index+1} of {sculptureList.length})
    </h3>
    <button onClick={handlemore}>
        {showmore?'hide':'show'} details
    </button>
        {showmore && <p>{sculpture.description}</p>}
    
    <img
        src={sculpture.url}
        alt={sculpture.alt}
    />
    </>

)
}

