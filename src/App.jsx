import { useState, useEffect, useRef } from 'react'
import { palabras } from './palabras.js';

function App() {

  const [mensaje, setMensaje] = useState(null);
  const [darkMode, setDarkMode] = useState(false)
  const [pantalla, setPantalla] = useState("inicio");
  const [vidas, setVidas] = useState(6);
  const canvasRef = useRef(null);
  const [palabraSecreta, setPalabraSecreta] = useState('');
  const [palabraAdivinada, setPalabraAdivinada] = useState([]);
  const [letrasIngresadas, setLetrasIngresadas] = useState(new Set());
  const [inputLetra, setInputLetra] = useState("");
  const [categoria, setCategoria] = useState(null);

  // Inicializa el juego
  const iniciar = () => {
    if (!categoria) return;

    const lista = palabras[categoria];
    const palabra = lista[Math.floor(Math.random() * lista.length)].toLowerCase();

    setPalabraSecreta(palabra);
    const palabraVisible = palabra.split("").map(c => (c === " " ? " " : "_"));
    setPalabraAdivinada(palabraVisible);
    setVidas(6);
    setLetrasIngresadas(new Set());
    setMensaje(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      comprobar();
    }
  };

  useEffect(() => {
    if (pantalla === "juego") {
      iniciar();
    }

  }, [pantalla,categoria]);

  const comprobar = (letraParam) => {
    if (juegoTerminado || (mensaje && (mensaje.tipo === "ganar" || mensaje.tipo === "perder"))) {
      return; // Detiene la ejecución si el juego ha finalizado.
    }
    const letra = (letraParam || inputLetra.trim().toLowerCase());
    if (letra === "" || !/^[a-zñ]$/.test(letra)) {
      setMensaje({ tipo: "error", texto: "Por favor, ingresa una letra válida." });
      return;
    }

    if (letrasIngresadas.has(letra)) return;


    setLetrasIngresadas(prev => new Set(prev).add(letra));

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

  const juegoTerminado = vidas === 0 || !palabraAdivinada.includes("_");

  useEffect(() => {
    if (palabraAdivinada.length > 0 && !palabraAdivinada.includes("_")) {
      setMensaje({ tipo: "ganar", texto: "¡Felicidades, ganaste!" });

    }
    if (vidas === 0) {
      setMensaje({
        tipo: "perder",
        texto: `Perdiste. La palabra era "${palabraSecreta}".`,
      });

    }
  }, [palabraAdivinada, vidas, palabraSecreta]);


  // Dibujo del ahorcado
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Ajustar el tamaño físico del canvas al tamaño CSS
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#999292";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "blue";
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
      ctx.lineWidth = 10;
      ctx.moveTo(w * 0.51, h * 0.44);
      ctx.lineTo(w * 0.51, h * 0.68);
      ctx.stroke();
    }
    if (vidas <= 3) {
      ctx.beginPath();
      ctx.lineWidth = 6;
      ctx.moveTo(w * 0.51, h * 0.48);
      ctx.lineTo(w * 0.45, h * 0.60);
      ctx.stroke();
    }
    if (vidas <= 2) {
      ctx.beginPath();
      ctx.lineWidth = 6;
      ctx.moveTo(w * 0.51, h * 0.48);
      ctx.lineTo(w * 0.57, h * 0.60);
      ctx.stroke();
    }
    if (vidas <= 1) {
      ctx.beginPath();
      ctx.lineWidth = 6;
      ctx.moveTo(w * 0.51, h * 0.68);
      ctx.lineTo(w * 0.45, h * 0.80);
      ctx.stroke();
    }
    if (vidas === 0) {
      ctx.beginPath();
      ctx.lineWidth = 6;
      ctx.moveTo(w * 0.51, h * 0.68);
      ctx.lineTo(w * 0.57, h * 0.80);
      ctx.stroke();
    }

  }, [vidas]);

  // 🔄 Redibujar al redimensionar pantalla
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);




  return (
    <>

      <div className={`font-sans min-h-screen w-full relative bg-cover bg-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
        }`}>
        {pantalla === "inicio" ? (
          <section className='flex flex-col items-center text-center p-2 w-full'>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 mt-3 text-center p-4">Juego del ahorcado</h1>
            <h2 className="text-xl font-semibold mb-3">Elegí una categoría:</h2>

            <div className="grid grid-cols-1 gap-3 mb-6 w-full max-w-xs">
              {Object.keys(palabras).map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoria(cat);
                    setPantalla("juego");
                  }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`absolute top-1 right-1 md:top-4 md:right-4 px-2 py-1 border rounded-md text-sm font-semibold transition ${darkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
            >
              {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
            </button>
            
          </section>
        ) : (
          <section className="flex flex-col justify-center items-center text-center p-4 sm:p-6 w-full ">
            <h1 className="text-3xl font-bold mb-6 mt-3 text-center">Juego del ahorcado</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`absolute top-1 right-1 md:top-4 md:right-4 px-3 py-1 border rounded-md text-sm font-semibold transition ${darkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
            >
              {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
            </button>
            <canvas
              ref={canvasRef}

              className="w-[90%] max-w-md aspect-[5/4] border border-gray-300 rounded-lg bg-gray-500 mb-2 w-full max-w-md p-2 mt-4"
            />

            <div className="text-base sm:text-lg mb-2 w-full">
              <div className="text-2xl sm:text-3xl tracking-widest font-bold mb-2 break-words" style={{ letterSpacing: "0.3em" }}>
                {palabraAdivinada.join("")}
              </div>
              <label htmlFor="adivina" className="block mb-2 text-gray-500">
                Adivina una letra:
              </label>
              <input
                id="adivina"
                type="text"
                maxLength={1}
                value={inputLetra}
                onChange={(e) => setInputLetra(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={juegoTerminado || (mensaje && mensaje.tipo === 'error')}
                className="h-10 w-12 sm:w-14 text-center text-2xl rounded-xl border-2 border-blue-500 bg-blue-400 focus:border-blue-400 focus:outline-none mb-2"
              />
              <button
                onClick={() => comprobar()}
                disabled={juegoTerminado}
                className="block mx-auto mt-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-lg hover:bg-indigo-700 transition w-1/2 sm:w-auto"
              >
                ¡Adivinar!
              </button>
              {/* TECLADO EN PANTALLA */}
              <div className="grid grid-cols-9 gap-2 max-w-md mx-auto mt-4">
                {"QWERTYUIOPASDFGHJKLÑZXCVBNM".split("").map((letra) => (
                  <button
                    key={letra}
                    onClick={() => {
                      setInputLetra(letra.toLowerCase());
                      comprobar(letra.toLowerCase());
                    }}
                    disabled={letrasIngresadas.has(letra.toLowerCase()) || juegoTerminado}
                    className={`
                        p-2 rounded-lg font-bold border 
                        ${letrasIngresadas.has(letra.toLowerCase())
                        ? palabraSecreta.includes(letra.toLowerCase())
                          ? "bg-green-500 text-white border-green-700 cursor-not-allowed"
                          : "bg-red-500 text-white border-red-700 cursor-not-allowed"
                        : "bg-gray-400 hover:bg-gray-500 dark:bg-gray-800 dark:hover:bg-gray-600"}
                  `}>
                    {letra}
                  </button>
                ))}
              </div>

              {/* Barra de vidas */}
              <div className="bg-gray-300 rounded-full h-3 mt-3 overflow-hidden">
                <div
                  className={` h-full transition-all duration-500 ${vidas > 3 ? "bg-green-500" : vidas > 1 ? "bg-yellow-500" : "bg-red-600"
                    }`}
                  style={{ width: `${(vidas / 6) * 100}%` }}
                ></div>
              </div>
              <p className="font-semibold">Vidas: {vidas}/6</p>
            </div>
            <button
              onClick={() => setPantalla("inicio")}
              className="mt-2 px-3 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 text-sm sm:text-base"
            >
              Volver al inicio
            </button>
            {/* Mensaje de ganar o perder */}
            {mensaje && (
              <div
                className={`fixed inset-0 flex items-center justify-center bg-black/60 z-50 transition-all`}
              >
                <div
                  className={`p-6 rounded-2xl text-center shadow-lg ${mensaje.tipo === "ganar"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                    }`}
                >
                  <h2 className="text-2xl font-bold mb-4">{mensaje.texto}</h2>
                  {mensaje.tipo === "error" && (
                    <button
                      onClick={() => setMensaje(null)}
                      className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
                    >
                      Cerrar
                    </button>
                  )}
                  {mensaje.tipo === "ganar" && (
                    <div>
                      <button
                        onClick={() => setMensaje(null)}
                        className="absolute top-60 right-147 px-2 bg-gray-200 text-black rounded-lg hover:bg-gray-200 transition"
                      >
                        X
                      </button>
                      <button
                        onClick={iniciar}
                        className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
                      >
                        jugar de nuevo
                      </button>
                    </div>

                  )}
                  {mensaje.tipo === "perder" && (
                    <div>
                      <button
                        onClick={() => setMensaje(null)}
                        className="absolute top-60 right-133 px-2 bg-gray-200 text-black rounded-lg hover:bg-gray-200 transition"
                      >
                        X
                      </button>
                      <button
                        onClick={iniciar}
                        className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
                      >
                        jugar de nuevo
                      </button>
                    </div>
                  )}

                </div>
              </div>
            )}
          </section>
        )}

      </div>
    </>
  )
}

export default App
