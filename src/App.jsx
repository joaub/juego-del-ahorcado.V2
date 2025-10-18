import { useState } from 'react'


function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <>
      <div className={`min-h-screen w-full relative bg-cover bg-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
      }`}>
        <section className='flex flex-col items-center p-2'>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Juego del ahorcado</h1>
          <button  onClick={() => setDarkMode(!darkMode)}>boton</button>
        </section>
        <section>
          <canvas></canvas>
          <input type="text" placeholder='letra'/>
          <button className='border border-black'>cambio</button>
        </section>
      </div>
    </>
  )
}

export default App
