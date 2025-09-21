import React from 'react'
import './modal.css'

const Modal = ({message, onClose}) => {
  return (
    <>
    <div className="modal-overlay">
      <div className="modal-box">
        <h3 style={{ color: "red" }}>⚠️ Error</h3>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
    </>
)
}

export default Modal