import { useState, useEffect, useRef } from 'react'


function App() {
   const palabras = ['javascript', 'react', 'hangman', 'programacion', 'desarrollo'];

  const [darkMode, setDarkMode] = useState(false)
  const [vidas, setVidas] = useState(6);
  const canvasRef = useRef(null);
  const [palabraSecreta, setPalabraSecreta] = useState('');
  const [palabraAdivinada, setPalabraAdivinada] = useState([]);

 
  

  // Dibujo del ahorcado
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#999292";
    ctx.fillRect(0, 0, canvas.height, canvas.width);

    ctx.fillStyle = "red";
    ctx.fillRect(0, 390, 150, 120);
    ctx.fillRect(70, 100, 15, 300);
    ctx.fillRect(70, 100, 150, 10);
    ctx.fillRect(210, 110, 10, 50);

    if (vidas <= 5) {
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(210, 170, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
    if (vidas <= 4) {
      ctx.beginPath();
      ctx.moveTo(210, 190);
      ctx.lineTo(210, 280);
      ctx.lineWidth = 12;
      ctx.stroke();
    }
    if (vidas <= 3) {
      ctx.beginPath();
      ctx.moveTo(210, 185);
      ctx.lineTo(170, 270);
      ctx.lineWidth = 7;
      ctx.stroke();
    }
    if (vidas <= 2) {
      ctx.beginPath();
      ctx.moveTo(210, 185);
      ctx.lineTo(250, 270);
      ctx.lineWidth = 7;
      ctx.stroke();
    }
    if (vidas <= 1) {
      ctx.beginPath();
      ctx.moveTo(210, 270);
      ctx.lineTo(170, 330);
      ctx.lineWidth = 7;
      ctx.stroke();
    }
    if (vidas === 0) {
      ctx.beginPath();
      ctx.moveTo(210, 270);
      ctx.lineTo(250, 330);
      ctx.lineWidth = 7;
      ctx.stroke();
    }
  }, [vidas]);

  return (
    <>
      <div className={`min-h-screen w-full relative bg-cover bg-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
        }`}>
        <section className='flex flex-col items-center p-2'>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Juego del ahorcado</h1>
          <button onClick={() => setDarkMode(!darkMode)}>boton</button>
        </section>
        <section className="flex flex-col justify-center items-center text-center p-6">
          <canvas ref={canvasRef} width="500" height="400" className="mb-4" />
          <div>
            <input type="text" placeholder='letra' />

            <button className='border border-black'>cambio</button>
          </div>
        </section>
      </div>
    </>
  )
}

export default App
