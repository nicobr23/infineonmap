import React from 'react'

function Modal({onClose}) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-10'>
      <div className='mt-10 flex flex-col bg-ocean-20 rounded-xl w-2/3 justify-center border-ocean-60 border-2'>
        <h1 className='text-center text-3xl font-bold text-ocean-80 mt-4 mobile:text-5xl'>Willkommen!</h1>
        <h2 className='text-center text-xs'>Vielen Dank für Ihren Besuch auf unserer Webseite...</h2>
        <p className='text-center m-4'>Unsere Webseite stellt Ihnen die Lieblingsorte und die schönsten Plätze in der Region vor, die von Infineon-Mitarbeitern empfohlen wurden. Entdecken Sie malerische Orte, versteckte Juwelen und sehenswerte Highlights, die von unserer Gemeinschaft sorgfältig ausgewählt wurden.</p>
        <p className='text-center'><button onClick={onClose} className='m-4 px-2 py-0.5 border-ocean-80 bg-white rounded-lg max-w-max border-2 text-xl font-bold text-ocean-80'>Explore</button></p>
      </div>
      {/*Popup info window*/}
      {/*
      Warum funzt die Zentrierung nicht? Einen Button in P is ja keine Lösung
      Das Logo muss irgendwie auch im Handy format angezeigt werden können
      Schrift größe verändern*/}
    </div>
  )
}

export default Modal
