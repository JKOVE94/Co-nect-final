import React, {useState, } from 'react'
import PostTost from "variables/Toast/PostToast";

const Test = () => {
    const [errType, setErrType] = useState(2); 
    const [Success, setSuccess] = useState(false);
    const toggleSuccess = () => {
        setSuccess(true)
        setTimeout(() => {setSuccess(false)}, 3000)
    }
   
    return (
        <>
              <PostTost showA={Success} toggleShowA={toggleSuccess} type={errType} />
        </>
    )
}

export default Test;