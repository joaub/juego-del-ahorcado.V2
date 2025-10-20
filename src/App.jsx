import { useState, useEffect, useRef } from 'react'
import { palabras } from './palabras.js';

function App() {
  

  const [darkMode, setDarkMode] = useState(false)
  const [pantalla, setPantalla] = useState("inicio");
  const [vidas, setVidas] = useState(6);
  const canvasRef = useRef(null);
  const [palabraSecreta, setPalabraSecreta] = useState('');
  const [palabraAdivinada, setPalabraAdivinada] = useState([]);
  const [letrasIngresadas, setLetrasIngresadas] = useState(new Set());
  const [inputLetra, setInputLetra] = useState("");

  // Inicializa el juego
  const iniciar = () => {
    const palabra = palabras[Math.floor(Math.random() * palabras.length)];
    setPalabraSecreta(palabra);
    setPalabraAdivinada(Array(palabra.length).fill("_"));
    setVidas(6);
    setLetrasIngresadas(new Set());
  };

  useEffect(() => {
    if (pantalla === "juego") {
      iniciar();
    }
  }, [pantalla]);

  const comprobar = () => {
    const letra = inputLetra.trim().toLowerCase();
    if (letra === "" || !/^[a-zñ]$/.test(letra)) {
      alert("Ingresa una letra válida.");
      return;
    }

    if (letrasIngresadas.has(letra)) {
      alert("Ya ingresaste esta letra.");
      return;
    }

    const nuevasLetras = new Set(letrasIngresadas);
    nuevasLetras.add(letra);
    setLetrasIngresadas(nuevasLetras);

    let acierto = false;
    const nuevaPalabra = [...palabraAdivinada];

    for (let i = 0; i < palabraSecreta.length; i++) {
      if (palabraSecreta[i] === letra) {
        nuevaPalabra[i] = letra;
        acierto = true;
      }
    }

    setPalabraAdivinada(nuevaPalabra);
    if (!acierto) setVidas((v) => v - 1);
    setInputLetra("");
  };

  useEffect(() => {
    if (palabraAdivinada.length > 0 && !palabraAdivinada.includes("_")) {
      alert("¡Felicidades, ganaste!");
      iniciar();
    }
    if (vidas === 0) {
      alert(`Has perdido. La palabra secreta era "${palabraSecreta}".`);
      iniciar();
    }
  }, [palabraAdivinada, vidas]);


  // Dibujo del ahorcado
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#999292";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "red";
    ctx.fillRect(w * 0.05, h * 0.95 - 20, w * 0.3, 20);
    ctx.fillRect(w * 0.2, h * 0.25, w * 0.03, h * 0.7);
    ctx.fillRect(w * 0.2, h * 0.25, w * 0.3, h * 0.03);
    ctx.fillRect(w * 0.5, h * 0.28, w * 0.02, h * 0.08);

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;

    if (vidas <= 5) {
      ctx.beginPath();
      ctx.arc(w * 0.51, h * 0.42, 20, 0, 2 * Math.PI);
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.stroke();
    }
    if (vidas <= 4) {
      ctx.beginPath();
      ctx.moveTo(w * 0.51, h * 0.44);
      ctx.lineTo(w * 0.51, h * 0.68);
      ctx.stroke();
    }
    if (vidas <= 3) {
      ctx.beginPath();
      ctx.moveTo(w * 0.51, h * 0.48);
      ctx.lineTo(w * 0.45, h * 0.60);
      ctx.stroke();
    }
    if (vidas <= 2) {
      ctx.beginPath();
      ctx.moveTo(w * 0.51, h * 0.48);
      ctx.lineTo(w * 0.57, h * 0.60);
      ctx.stroke();
    }
    if (vidas <= 1) {
      ctx.beginPath();
      ctx.moveTo(w * 0.51, h * 0.68);
      ctx.lineTo(w * 0.45, h * 0.80);
      ctx.stroke();
    }
    if (vidas === 0) {
      ctx.beginPath();
      ctx.moveTo(w * 0.51, h * 0.68);
      ctx.lineTo(w * 0.57, h * 0.80);
      ctx.stroke();
    }
  }, [vidas]);

  return (
    <>

      <div className={`font-sans min-h-screen w-full relative bg-cover bg-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
        }`}>
        {pantalla === "inicio" ? (
          <section className='flex flex-col items-center p-2 w-full'>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 p-4">Juego del ahorcado</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`absolute top-1 right-1 md:top-4 md:right-4 px-2 py-1 rounded-md text-sm font-semibold transition ${darkMode
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
            >
              {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
            </button>
            <button
              onClick={() => setPantalla("juego")}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white text-xl rounded-lg transition w-3/4 sm:w-auto"
            >
              Iniciar Juego
            </button>
          </section>
        ) : (
          <section className="flex flex-col justify-center items-center text-center p-4 sm:p-6 w-full ">
          <button
              onClick={() => setDarkMode(!darkMode)}
              className={`absolute top-1 right-1 md:top-4 md:right-4 px-3 py-1 rounded-md text-sm font-semibold transition ${darkMode
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
            >
              {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
            </button>
          <canvas
            ref={canvasRef}
            width={window.innerWidth < 640 ? 280 : 500}
            height={window.innerWidth < 640 ? 240 : 400}
            className="mb-4 w-full max-w-md border border-gray-300 rounded-lg bg-gray-100 p-2"
          />
          <div className="text-base sm:text-lg mb-4 w-full">
            <div className="text-2xl sm:text-3xl tracking-widest font-bold mb-4 break-words">
              {palabraAdivinada.join(" ")}
            </div>
            <label htmlFor="adivina" className="block mb-2 text-gray-700">
              Adivina una letra:
            </label>
            <input
              id="adivina"
              type="text"
              maxLength={1}
              value={inputLetra}
              onChange={(e) => setInputLetra(e.target.value)}
              className="h-10 w-12 sm:w-14 text-center text-2xl rounded-xl border-2 border-blue-500 bg-blue-400 focus:border-blue-400 focus:outline-none mb-3"
            />
            <button
              onClick={comprobar}
              className="block mx-auto mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-lg hover:bg-indigo-700 transition w-1/2 sm:w-auto"
            >
              ¡Adivinar!
            </button>
            <div className="text-lg sm:text-xl font-bold text-red-600 mt-3">
              Las vidas que te quedan son: {vidas}
            </div>
          </div>
          <button
            onClick={() => setPantalla("inicio")}
            className="mt-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 text-sm sm:text-base"
          >
            Volver al inicio
          </button>
        </section>
        )}
      </div>
    </>
  )
}

export default App
