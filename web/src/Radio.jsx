import { useEffect, useRef, useState } from "react";

// Rádio da garagem: toca uma playlist do YouTube Music, mas com a nossa cara.
// O vídeo do YouTube fica escondido (toca só o som) e nós desenhamos os botões.
const PLAYLIST_ID = "PL4Vecib-qDHuMZDeK_wq74DfAvVRrl5lL";

// Carrega o script da API do YouTube uma única vez e avisa quando estiver pronto.
function carregarApiYouTube() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    const anterior = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (anterior) anterior();
      resolve(window.YT);
    };
    if (!document.getElementById("youtube-iframe-api")) {
      const script = document.createElement("script");
      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
  });
}

export default function Radio() {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [pronto, setPronto] = useState(false);
  const [tocando, setTocando] = useState(false);
  const [aleatorio, setAleatorio] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [capa, setCapa] = useState("");
  const [volume, setVolume] = useState(50);

  // Cria o player do YouTube quando a tela abre.
  useEffect(() => {
    let cancelado = false;
    carregarApiYouTube().then((YT) => {
      if (cancelado) return;
      playerRef.current = new YT.Player(containerRef.current, {
        height: "1",
        width: "1",
        playerVars: { listType: "playlist", list: PLAYLIST_ID },
        events: {
          onReady: (e) => {
            e.target.setVolume(volume);
            setPronto(true);
          },
          onStateChange: (e) => {
            setTocando(e.data === YT.PlayerState.PLAYING);
            const dados = e.target.getVideoData();
            if (dados && dados.title) {
              setTitulo(dados.title);
              setCapa(`https://img.youtube.com/vi/${dados.video_id}/mqdefault.jpg`);
            }
          },
        },
      });
    });
    return () => {
      cancelado = true;
      if (playerRef.current && playerRef.current.destroy) playerRef.current.destroy();
    };
  }, []);

  function alternarPlay() {
    const p = playerRef.current;
    if (!p) return;
    if (tocando) p.pauseVideo();
    else p.playVideo();
  }

  function proxima() {
    playerRef.current && playerRef.current.nextVideo();
  }

  function anterior() {
    playerRef.current && playerRef.current.previousVideo();
  }

  function alternarAleatorio() {
    const p = playerRef.current;
    if (!p) return;
    const novo = !aleatorio;
    setAleatorio(novo);
    p.setShuffle(novo);
  }

  function mudarVolume(v) {
    setVolume(v);
    playerRef.current && playerRef.current.setVolume(v);
  }

  return (
    <div className="radio">
      {/* O player de verdade do YouTube fica aqui, escondido por CSS */}
      <div ref={containerRef} className="radio-oculto"></div>

      {capa ? (
        <img className="radio-capa" src={capa} alt="Capa da música" />
      ) : (
        <div className="radio-capa radio-capa-vazia">🎵</div>
      )}

      <p className="radio-titulo">
        {titulo || (pronto ? "Pronto para tocar" : "Carregando rádio...")}
      </p>

      <div className="radio-controles">
        <button onClick={anterior} title="Anterior">⏮</button>
        <button className="radio-play" onClick={alternarPlay} title="Play / Pause">
          {tocando ? "⏸" : "▶"}
        </button>
        <button onClick={proxima} title="Próxima">⏭</button>
        <button
          className={aleatorio ? "radio-ativo" : ""}
          onClick={alternarAleatorio}
          title={aleatorio ? "Aleatório: ligado" : "Aleatório: desligado"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 3h5v5" />
            <path d="M4 20 21 3" />
            <path d="M21 16v5h-5" />
            <path d="M15 15l6 6" />
            <path d="M4 4l5 5" />
          </svg>
        </button>
      </div>

      <div className="radio-volume">
        <span>🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => mudarVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
