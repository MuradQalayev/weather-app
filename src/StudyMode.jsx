import React from 'react'
import { useNavigate } from 'react-router-dom'

const StudyMode = () => {
  const navigate = useNavigate()
  return (
    <>
      <button onClick={()=>navigate('/')}>back</button>
    </>
  )
}

export default StudyMode