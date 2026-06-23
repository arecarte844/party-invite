import React, { useCallback, useEffect, useRef, useState } from "react";

const SHEETS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbxp0sh0HMzrRhHLHn9slw3Porzh22YifKQUzt5msSEC3dfWdNFh8Yy2XWx4XN9aPPnRQw/exec";

async function saveRSVP(guestName, status) {
  try {
    await fetch(SHEETS_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ guestName, status }),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending RSVP:", error);
    return { success: false, error };
  }
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [eagleFlyover, setEagleFlyover] = useState(false);

  const openEnvelope = useCallback(() => {
    if (opening || opened) return;

    setOpening(true);

    setTimeout(() => {
      setOpened(true);
      setShowFireworks(true);
    }, 1200);
  }, [opening, opened]);

  const handleRSVP = useCallback(async (guestName, status) => {
    await saveRSVP(guestName, status);

    setRsvpStatus(status);

    if (status === "yes") {
      setShowFireworks(true);
      setEagleFlyover(true);

      setTimeout(() => {
        setEagleFlyover(false);
      }, 4200);
    }
  }, []);

  return (
    <main className="party-page">
      <AppStyles />
      <PatrioticSky />

      {showFireworks && (
        <Fireworks
          onComplete={() => {
            setShowFireworks(false);
          }}
        />
      )}

      {eagleFlyover && (
        <div className="eagle-flyover">
          <Eagle size={190} mood="flying" />
        </div>
      )}

      <section className="stage">
        {!opened ? (
          <Envelope opening={opening} onOpen={openEnvelope} />
        ) : (
          <InvitationCard rsvpStatus={rsvpStatus} onRSVP={handleRSVP} />
        )}
      </section>
    </main>
  );
}

function PatrioticSky() {
  return (
    <div className="patriotic-sky" aria-hidden="true">
      <div className="flag-wave">
        {Array.from({ length: 14 }).map((_, index) => (
          <div
            key={index}
            className={index % 2 === 0 ? "stripe stripe-red" : "stripe stripe-cream"}
            style={{
              top: `${index * 7.15}%`,
              animationDelay: `${index * -0.25}s`,
            }}
          />
        ))}
      </div>

      <div className="blue-field">
        {Array.from({ length: 45 }).map((_, index) => (
          <span
            key={index}
            className="field-star"
            style={{
              left: `${8 + (index % 9) * 10}%`,
              top: `${10 + Math.floor(index / 9) * 16}%`,
              animationDelay: `${index * 0.07}s`,
            }}
          >
            ★
          </span>
        ))}
      </div>

      <div className="dark-overlay" />

      {Array.from({ length: 70 }).map((_, index) => (
        <span
          key={index}
          className="floating-star"
          style={{
            left: `${(index * 31) % 100}%`,
            top: `${(index * 47) % 100}%`,
            fontSize: `${8 + (index % 4) * 4}px`,
            animationDelay: `${index * 0.13}s`,
            animationDuration: `${2.5 + (index % 5) * 0.7}s`,
          }}
        >
          ★
        </span>
      ))}

      <div className="light-beam beam-one" />
      <div className="light-beam beam-two" />
    </div>
  );
}

function Envelope({ opening, onOpen }) {
  return (
    <div className={`envelope-scene ${opening ? "scene-opening" : ""}`}>
      <div className="envelope-title">
        <p className="mini-kicker">Special Delivery</p>
        <h1>Party in the USA</h1>
        <p>Toca el sello para abrir tu invitación</p>
      </div>

      <button className="envelope-button" onClick={onOpen} aria-label="Abrir invitación">
        <div className="envelope-shadow" />

        <div className="envelope-body">
          <div className="envelope-flag">
            {Array.from({ length: 7 }).map((_, index) => (
              <span
                key={index}
                className={index % 2 === 0 ? "mail-stripe red" : "mail-stripe cream"}
              />
            ))}
          </div>

          <div className="mail-blue">
            {Array.from({ length: 16 }).map((_, index) => (
              <span key={index}>★</span>
            ))}
          </div>

          <div className="mail-left-fold" />
          <div className="mail-right-fold" />
          <div className="mail-bottom-fold" />
        </div>

        <div className="envelope-flap" />

        <div className="seal">
          <span>USA</span>
          <small>1776</small>
        </div>

        <div className="letter-preview">
          <div className="preview-line short" />
          <div className="preview-line" />
          <div className="preview-line" />
          <div className="preview-badge">INVITATION</div>
        </div>
      </button>
    </div>
  );
}

function InvitationCard({ rsvpStatus, onRSVP }) {
  return (
    <article className={`invitation-card ${rsvpStatus === "no" ? "invitation-muted" : ""}`}>
      <div className="card-glow" />

      <header className="card-header">
        <div className="header-stars">
          {Array.from({ length: 18 }).map((_, index) => (
            <span key={index}>★</span>
          ))}
        </div>

        <div className="crest">
          <Eagle mood={rsvpStatus === "no" ? "sad" : "proud"} size={165} />
        </div>

        <p className="card-kicker">Party in the USA</p>

        <h1 className="main-title">
          <span>Fiesta de Piscina</span>
          <span>y Barbacoa Americana</span>
        </h1>

        <p className="subtitle">
          Una fiesta americana con piscina, barbacoa, bebidas, y Mundial.
        </p>
      </header>

      <section className="details">
        <DetailBlock title="Horario">
          Desde las 12:00 PM hasta que el cuerpo aguante. Nota: a las 19:00
          podremos ver juntos la primera ronda de eliminatorias del Mundial.
        </DetailBlock>

        <DetailBlock title="Dónde">
          <MapCard />
        </DetailBlock>

        <DetailBlock title="Actividades">
          Spikeball y los clásicos juegos americanos.
        </DetailBlock>

        <DetailBlock title="Código de vestimenta">
          Vestir de rojo, blanco o azul (opcional). Los sombreros de vaquero son
          bienvenidos. Imprescindible traer bañador.
        </DetailBlock>

        <DetailBlock title="Comida">
          Yo pondré comida americana y sandía y algunas bebidas. Cada uno debe
          traer un picoteo de su elección para compartir.
        </DetailBlock>
      </section>

      <section className="rsvp-panel">
        <div className="rsvp-header">
          <span />
          <p>Confirmación</p>
          <span />
        </div>

        <h2>¿Vienes?</h2>

        <RSVPForm onRSVP={onRSVP} status={rsvpStatus} />
      </section>
    </article>
  );
}

function DetailBlock({ title, children }) {
  return (
    <div className="detail-block">
      <p className="detail-title">{title}</p>
      <div className="detail-content">{children}</div>
    </div>
  );
}

function RSVPForm({ onRSVP, status }) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(null);

  const hasName = name.trim().length > 0;

  const handleSubmit = async (value) => {
    if (!hasName || submitting) return;

    setSubmitting(value);

    await onRSVP(name.trim(), value);

    setSubmitting(null);
  };

  if (status) {
    return (
      <div className={`rsvp-result ${status === "yes" ? "result-yes" : "result-no"}`}>
        {status === "yes" ? (
          <>
            <p className="result-small">Confirmado</p>
            <p className="result-main">Te esperamos en la fiesta.</p>
          </>
        ) : (
          <>
            <p className="result-small">Respuesta recibida</p>
            <p className="result-main">Te echaremos de menos.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="rsvp-form">
      <input
        type="text"
        value={name}
        placeholder="Tu nombre y apellido"
        onChange={(event) => setName(event.target.value)}
      />

      <div className="rsvp-buttons">
        <button
          type="button"
          disabled={!hasName || submitting !== null}
          className="yes-button"
          onClick={() => handleSubmit("yes")}
        >
          {submitting === "yes" ? "Enviando..." : "Sí, allí estaré"}
        </button>

        <button
          type="button"
          disabled={!hasName || submitting !== null}
          className="no-button"
          onClick={() => handleSubmit("no")}
        >
          {submitting === "no" ? "Enviando..." : "No podré ir"}
        </button>
      </div>
    </div>
  );
}

function MapCard() {
  return (
    <a
      className="map-card"
      href="https://maps.google.com/?q=Somosierra+16,+Pozuelo+de+Alarcon"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="map-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.87-3.13-7-7-7Z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      </div>

      <div>
        <strong>Somosierra 16</strong>
        <span>Pozuelo de Alarcón</span>
      </div>

      <div className="map-arrow">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      </div>
    </a>
  );
}

function Eagle({ size = 170, mood = "proud" }) {
  const sad = mood === "sad";
  const flying = mood === "flying";

  return (
    <svg
      width={size}
      height={(size * 0.8).toFixed(0)}
      viewBox="0 0 260 210"
      className={`eagle-svg ${sad ? "eagle-sad" : ""} ${flying ? "eagle-flying-svg" : ""}`}
      role="img"
      aria-label="Águila calva"
    >
      <defs>
        <linearGradient id="wingGradient" x1="0" x2="1">
          <stop offset="0%" stopColor="#2c2c2c" />
          <stop offset="50%" stopColor="#5a5a5a" />
          <stop offset="100%" stopColor="#2c2c2c" />
        </linearGradient>

        <linearGradient id="goldGradient" x1="0" x2="1">
          <stop offset="0%" stopColor="#c9952c" />
          <stop offset="50%" stopColor="#f2d27b" />
          <stop offset="100%" stopColor="#b77d18" />
        </linearGradient>
      </defs>

      <circle cx="130" cy="105" r="82" fill="#d4a017" opacity="0.13" />

      <g className="left-wing">
        <path
          d="M112 83 C74 53 34 54 8 82 C39 82 58 90 78 103 C55 105 38 116 23 134 C58 126 82 126 110 142 Z"
          fill="url(#wingGradient)"
        />
        <path
          d="M94 96 C62 83 36 85 17 99"
          fill="none"
          stroke="#f5f0e6"
          strokeWidth="2"
          opacity="0.25"
        />
      </g>

      <g className="right-wing">
        <path
          d="M148 83 C186 53 226 54 252 82 C221 82 202 90 182 103 C205 105 222 116 237 134 C202 126 178 126 150 142 Z"
          fill="url(#wingGradient)"
        />
        <path
          d="M166 96 C198 83 224 85 243 99"
          fill="none"
          stroke="#f5f0e6"
          strokeWidth="2"
          opacity="0.25"
        />
      </g>

      <ellipse cx="130" cy="118" rx="33" ry="43" fill="#3c3c3c" />
      <path d="M103 152 C118 192 142 192 157 152 C145 163 115 163 103 152Z" fill="#f5f0e6" />

      <circle cx="130" cy="70" r="31" fill="#f8f6ef" />
      <path d="M151 69 178 78 151 88Z" fill="url(#goldGradient)" />

      {/* Cowboy hat */}
      <g>
        {/* crown */}
        <rect x="108" y="24" width="44" height="20" rx="7" fill="#a56a2c" />
        <path
          d="M106 33 C111 20 120 16 130 17 C140 16 149 20 154 33 L152 44 C145 40 138 38 130 38 C122 38 115 40 108 44 Z"
          fill="#b57a3a"
        />
        {/* band */}
        <rect x="113" y="36" width="34" height="5" rx="2.5" fill="#b22234" />
        {/* brim */}
        <path
          d="M84 47 C98 41 114 39 130 39 C146 39 162 41 176 47 C162 53 146 56 130 56 C114 56 98 53 84 47 Z"
          fill="#7a4a21"
        />
      </g>

      {sad ? (
        <path
          d="M118 65 C123 71 128 71 133 65"
          fill="none"
          stroke="#0d1b3f"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ) : (
        <circle cx="121" cy="63" r="4" fill="#0d1b3f" />
      )}

      {sad && (
        <g className="tear">
          <path
            d="M116 73 C112 79 111 83 116 87 C121 83 120 79 116 73Z"
            fill="#7fb3e0"
          />
        </g>
      )}

      <path
        d="M116 159 109 177 M144 159 151 177"
        stroke="url(#goldGradient)"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Fireworks({ onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    const colors = ["#b22234", "#f5f0e6", "#ffffff", "#1b2a4a", "#d4a017"];
    const particles = [];

    function createBurst(x, y) {
      for (let i = 0; i < 90; i++) {
        const angle = (Math.PI * 2 * i) / 90;
        const speed = 1.8 + Math.random() * 5.8;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 90 + Math.random() * 35,
          size: 1.5 + Math.random() * 3.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    const bursts = [
      [0.16, 0.22],
      [0.48, 0.15],
      [0.82, 0.24],
      [0.31, 0.42],
      [0.69, 0.39],
    ];

    bursts.forEach(([x, y], index) => {
      setTimeout(() => {
        createBurst(canvas.width * x, canvas.height * y);
      }, index * 230);
    });

    let frame;
    let elapsed = 0;

    function draw() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.04;
        particle.life -= 1;

        context.globalAlpha = Math.max(particle.life / 100, 0);
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
      elapsed += 16;

      if (elapsed < 3800) {
        frame = requestAnimationFrame(draw);
      } else {
        onComplete();
      }
    }

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [onComplete]);

  return <canvas ref={canvasRef} className="fireworks-canvas" aria-hidden="true" />;
}

function AppStyles() {
  return (
    <style>{`
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
      }

      .party-page {
        min-height: 100vh;
        width: 100%;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 28px 16px;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #0d1b3f;
        background: #07142f;
      }

      .stage {
        position: relative;
        z-index: 10;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .patriotic-sky {
        position: absolute;
        inset: 0;
        overflow: hidden;
      }

      .flag-wave {
        position: absolute;
        inset: -8% -8%;
        transform: rotate(-8deg) scale(1.22);
        opacity: 0.88;
      }

      .stripe {
        position: absolute;
        left: -10%;
        width: 125%;
        height: 7.3%;
        animation: waveStripe 7s ease-in-out infinite;
      }

      .stripe-red {
        background: linear-gradient(90deg, #7c1020, #b22234, #d24152, #b22234);
      }

      .stripe-cream {
        background: linear-gradient(90deg, #d7d2c3, #fff8e7, #ffffff, #f5f0e6);
      }

      .blue-field {
        position: absolute;
        top: 0;
        left: 0;
        width: min(520px, 60vw);
        height: min(360px, 43vh);
        background:
          radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), transparent 28%),
          linear-gradient(135deg, #1b2a4a, #071739);
        box-shadow: 0 25px 80px rgba(0,0,0,0.32);
        border-bottom-right-radius: 38px;
        overflow: hidden;
      }

      .field-star {
        position: absolute;
        color: #f5f0e6;
        font-size: 14px;
        opacity: 0.85;
        animation: starPulse 2.4s ease-in-out infinite;
      }

      .dark-overlay {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 25%),
          linear-gradient(180deg, rgba(7,20,47,0.15), rgba(7,20,47,0.9));
      }

      .floating-star {
        position: absolute;
        color: rgba(245,240,230,0.5);
        animation: floatStar linear infinite;
      }

      .light-beam {
        position: absolute;
        width: 280px;
        height: 120vh;
        top: -10vh;
        background: linear-gradient(180deg, transparent, rgba(255,255,255,0.13), transparent);
        filter: blur(18px);
        transform: rotate(22deg);
        animation: beamMove 9s ease-in-out infinite;
      }

      .beam-one {
        left: 12%;
      }

      .beam-two {
        right: 8%;
        animation-delay: -4s;
      }

      .envelope-scene {
        width: 100%;
        max-width: 640px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 32px;
        animation: sceneIn 0.9s ease both;
      }

      .envelope-title {
        text-align: center;
        color: #fff8e7;
        text-shadow: 0 4px 30px rgba(0,0,0,0.45);
      }

      .envelope-title .mini-kicker {
        margin: 0 0 8px;
        text-transform: uppercase;
        letter-spacing: 0.32em;
        font-size: 12px;
        font-weight: 900;
        color: #d4a017;
      }

      .envelope-title h1 {
        margin: 0;
        font-size: clamp(48px, 10vw, 88px);
        line-height: 0.88;
        text-transform: uppercase;
        letter-spacing: -0.06em;
        color: #ffffff;
        -webkit-text-stroke: 2px rgba(178,34,52,0.8);
        text-shadow:
          0 4px 0 #b22234,
          0 10px 35px rgba(0,0,0,0.55);
      }

      .envelope-title p:last-child {
        margin: 14px 0 0;
        font-size: 16px;
        font-weight: 800;
        color: #fff8e7;
      }

      .envelope-button {
        appearance: none;
        border: 0;
        background: transparent;
        position: relative;
        width: min(88vw, 460px);
        height: 300px;
        cursor: pointer;
        perspective: 1100px;
        padding: 0;
        animation: envelopeFloat 3.2s ease-in-out infinite;
      }

      .envelope-shadow {
        position: absolute;
        left: 8%;
        right: 8%;
        bottom: 5px;
        height: 40px;
        border-radius: 999px;
        background: rgba(0,0,0,0.45);
        filter: blur(18px);
        transform: scaleX(0.9);
      }

      .envelope-body {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 18px;
        height: 230px;
        border-radius: 22px;
        overflow: hidden;
        border: 5px solid #fff8e7;
        box-shadow:
          0 28px 80px rgba(0,0,0,0.45),
          inset 0 0 0 2px rgba(13,27,63,0.16);
        background: #fff8e7;
      }

      .envelope-flag {
        position: absolute;
        inset: 0;
      }

      .mail-stripe {
        display: block;
        height: 14.285%;
      }

      .mail-stripe.red {
        background: #b22234;
      }

      .mail-stripe.cream {
        background: #fff8e7;
      }

      .mail-blue {
        position: absolute;
        left: 0;
        top: 0;
        width: 45%;
        height: 55%;
        background: #1b2a4a;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2px;
        padding: 16px;
        color: #fff8e7;
        font-size: 13px;
      }

      .mail-left-fold,
      .mail-right-fold,
      .mail-bottom-fold {
        position: absolute;
        pointer-events: none;
      }

      .mail-left-fold {
        left: 0;
        bottom: 0;
        width: 52%;
        height: 78%;
        background: rgba(255,248,231,0.88);
        clip-path: polygon(0 0, 100% 52%, 0 100%);
        border-right: 2px solid rgba(13,27,63,0.12);
      }

      .mail-right-fold {
        right: 0;
        bottom: 0;
        width: 52%;
        height: 78%;
        background: rgba(255,248,231,0.9);
        clip-path: polygon(100% 0, 0 52%, 100% 100%);
        border-left: 2px solid rgba(13,27,63,0.12);
      }

      .mail-bottom-fold {
        left: 0;
        right: 0;
        bottom: 0;
        height: 62%;
        background: linear-gradient(180deg, rgba(255,248,231,0.8), rgba(245,240,230,0.96));
        clip-path: polygon(0 100%, 50% 20%, 100% 100%);
      }

      .envelope-flap {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 132px;
        height: 145px;
        border-radius: 22px 22px 0 0;
        background:
          linear-gradient(135deg, rgba(255,255,255,0.08), transparent 30%),
          linear-gradient(135deg, #1b2a4a, #b22234);
        clip-path: polygon(0 0, 100% 0, 50% 100%);
        transform-origin: top center;
        transition: transform 1s cubic-bezier(.16,.8,.22,1);
        box-shadow: inset 0 -5px 0 rgba(255,248,231,0.24);
        z-index: 4;
      }

      .seal {
        position: absolute;
        left: 50%;
        top: 148px;
        width: 92px;
        height: 92px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background:
          radial-gradient(circle at 35% 30%, #f3d783, #d4a017 45%, #a86d0e);
        border: 6px solid #fff8e7;
        box-shadow:
          0 18px 40px rgba(0,0,0,0.35),
          inset 0 0 0 3px rgba(178,34,52,0.35);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 5;
        transition: opacity 0.4s ease, transform 0.6s ease;
        animation: sealPulse 1.7s ease-in-out infinite;
      }

      .seal span {
        font-size: 25px;
        font-weight: 1000;
        letter-spacing: -0.08em;
        color: #1b2a4a;
        line-height: 1;
      }

      .seal small {
        margin-top: 2px;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.18em;
        color: #b22234;
      }

      .letter-preview {
        position: absolute;
        left: 50%;
        bottom: 38px;
        width: 70%;
        height: 170px;
        transform: translateX(-50%) translateY(80px);
        background: #fffdf5;
        border-radius: 18px 18px 8px 8px;
        border: 4px solid #d4a017;
        z-index: 2;
        padding: 28px;
        box-shadow: 0 18px 50px rgba(0,0,0,0.22);
        transition: transform 1.1s cubic-bezier(.16,.8,.22,1), opacity 0.6s ease;
        opacity: 0;
      }

      .preview-line {
        height: 10px;
        border-radius: 999px;
        background: #1b2a4a;
        opacity: 0.25;
        margin-bottom: 13px;
      }

      .preview-line.short {
        width: 45%;
        background: #b22234;
        opacity: 0.55;
      }

      .preview-badge {
        margin-top: 25px;
        display: inline-block;
        border: 2px solid #b22234;
        color: #b22234;
        font-weight: 1000;
        font-size: 12px;
        letter-spacing: 0.18em;
        padding: 8px 12px;
        transform: rotate(-4deg);
      }

      .scene-opening .envelope-flap {
        transform: rotateX(178deg);
      }

      .scene-opening .seal {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5) rotate(25deg);
      }

      .scene-opening .letter-preview {
        opacity: 1;
        transform: translateX(-50%) translateY(-60px);
      }

      .invitation-card {
        position: relative;
        width: min(94vw, 590px);
        border-radius: 32px;
        overflow: hidden;
        background:
          linear-gradient(180deg, #fffdf5 0%, #f5f0e6 55%, #fff8e7 100%);
        border: 5px solid #fff8e7;
        box-shadow:
          0 35px 110px rgba(0,0,0,0.55),
          0 0 0 2px rgba(212,160,23,0.55);
        animation: cardReveal 0.9s cubic-bezier(.16,.8,.22,1) both;
      }

      .card-glow {
        position: absolute;
        inset: -80px;
        background:
          radial-gradient(circle at 20% 0%, rgba(178,34,52,0.18), transparent 30%),
          radial-gradient(circle at 90% 10%, rgba(27,42,74,0.2), transparent 32%),
          radial-gradient(circle at 50% 100%, rgba(212,160,23,0.18), transparent 35%);
        pointer-events: none;
      }

      .card-header {
        position: relative;
        padding: 34px 28px 26px;
        text-align: center;
        background:
          linear-gradient(180deg, rgba(27,42,74,0.98), rgba(13,27,63,0.96));
        color: #fff8e7;
      }

      .header-stars {
        position: absolute;
        inset: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 13px;
        align-content: center;
        justify-content: center;
        color: rgba(255,248,231,0.12);
        font-size: 20px;
        pointer-events: none;
      }

      .crest {
        position: relative;
        width: 190px;
        height: 155px;
        margin: 0 auto 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background:
          radial-gradient(circle, rgba(255,248,231,0.18), transparent 65%);
      }

      .card-kicker {
        position: relative;
        margin: 0 auto 12px;
        width: fit-content;
        padding: 8px 16px;
        border-radius: 999px;
        background: #b22234;
        border: 2px solid #fff8e7;
        color: #ffffff;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        font-size: 12px;
        font-weight: 1000;
        box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      }

      .main-title {
        position: relative;
        margin: 0;
        font-size: clamp(34px, 8vw, 58px);
        line-height: 0.92;
        letter-spacing: -0.06em;
        text-transform: uppercase;
        font-weight: 1000;
        color: #ffffff;
        text-shadow:
          0 4px 0 #b22234,
          0 9px 0 rgba(212,160,23,0.35),
          0 16px 35px rgba(0,0,0,0.45);
      }

      .main-title span {
        display: block;
      }

      .main-title span:nth-child(2) {
        color: #fff8e7;
        font-size: 0.82em;
      }

      .subtitle {
        position: relative;
        margin: 20px auto 0;
        max-width: 420px;
        color: rgba(255,248,231,0.84);
        font-weight: 700;
        line-height: 1.45;
      }

      .details {
        position: relative;
        padding: 26px;
        display: grid;
        gap: 14px;
      }

      .detail-block {
        background: rgba(255,255,255,0.78);
        border: 2px solid rgba(27,42,74,0.12);
        border-radius: 20px;
        padding: 17px 18px;
        box-shadow: 0 10px 25px rgba(13,27,63,0.08);
      }

      .detail-title {
        margin: 0 0 6px;
        color: #b22234;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-weight: 1000;
      }

      .detail-content {
        color: #0d1b3f;
        font-size: 15px;
        line-height: 1.48;
        font-weight: 650;
      }

      .map-card {
        display: flex;
        align-items: center;
        gap: 14px;
        text-decoration: none;
        color: #0d1b3f;
        background:
          linear-gradient(90deg, rgba(178,34,52,0.08), rgba(27,42,74,0.08));
        border: 2px solid rgba(27,42,74,0.13);
        border-radius: 16px;
        padding: 14px;
        transition: transform 0.2s ease, border-color 0.2s ease;
      }

      .map-card:hover {
        transform: translateY(-2px);
        border-color: #b22234;
      }

      .map-icon {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: #b22234;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
      }

      .map-icon svg {
        width: 25px;
        height: 25px;
        fill: #fff8e7;
      }

      .map-card strong {
        display: block;
        font-weight: 1000;
      }

      .map-card span {
        display: block;
        font-size: 13px;
        color: rgba(13,27,63,0.7);
        font-weight: 700;
      }

      .map-arrow {
        margin-left: auto;
      }

      .map-arrow svg {
        width: 24px;
        height: 24px;
        fill: none;
        stroke: #1b2a4a;
        stroke-width: 2.5;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .rsvp-panel {
        position: relative;
        margin: 0 26px 26px;
        padding: 24px;
        border-radius: 26px;
        background:
          linear-gradient(135deg, #1b2a4a, #0d1b3f);
        color: #fff8e7;
        border: 3px solid #d4a017;
        box-shadow: 0 20px 40px rgba(13,27,63,0.22);
      }

      .rsvp-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }

      .rsvp-header span {
        height: 2px;
        flex: 1;
        background: linear-gradient(90deg, transparent, #d4a017, transparent);
      }

      .rsvp-header p {
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: #d4a017;
        font-size: 11px;
        font-weight: 1000;
      }

      .rsvp-panel h2 {
        margin: 0 0 16px;
        text-align: center;
        font-size: 30px;
        line-height: 1;
        text-transform: uppercase;
        letter-spacing: -0.04em;
      }

      .rsvp-form {
        display: grid;
        gap: 13px;
      }

      .rsvp-form input {
        width: 100%;
        border: 0;
        outline: none;
        border-radius: 16px;
        padding: 15px 16px;
        font-size: 16px;
        font-weight: 800;
        color: #0d1b3f;
        background: #fffdf5;
        box-shadow: inset 0 0 0 2px rgba(255,255,255,0.2);
      }

      .rsvp-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .rsvp-buttons button {
        border: 0;
        min-height: 54px;
        border-radius: 16px;
        font-weight: 1000;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        cursor: pointer;
        transition: transform 0.18s ease, filter 0.18s ease, opacity 0.18s ease;
      }

      .rsvp-buttons button:hover:not(:disabled) {
        transform: translateY(-2px);
        filter: brightness(1.05);
      }

      .rsvp-buttons button:active:not(:disabled) {
        transform: translateY(1px);
      }

      .rsvp-buttons button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .yes-button {
        background: linear-gradient(135deg, #b22234, #e34a5d);
        color: #ffffff;
      }

      .no-button {
        background: #fff8e7;
        color: #1b2a4a;
      }

      .rsvp-result {
        text-align: center;
        border-radius: 18px;
        padding: 18px;
        background: rgba(255,255,255,0.1);
      }

      .result-small {
        margin: 0 0 5px;
        color: #d4a017;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 12px;
        font-weight: 1000;
      }

      .result-main {
        margin: 0;
        font-size: 18px;
        font-weight: 900;
      }

      .invitation-muted {
        filter: saturate(0.72);
      }

      .eagle-svg {
        overflow: visible;
      }

      .left-wing {
        transform-origin: 112px 90px;
        animation: leftWing 1.35s ease-in-out infinite;
      }

      .right-wing {
        transform-origin: 148px 90px;
        animation: rightWing 1.35s ease-in-out infinite;
      }

      .eagle-sad .left-wing {
        animation: sadLeftWing 0.9s ease forwards;
      }

      .eagle-sad .right-wing {
        animation: sadRightWing 0.9s ease forwards;
      }

      .tear {
        animation: tearFall 1.8s ease-in infinite;
      }

      .eagle-flyover {
        position: fixed;
        top: 22%;
        left: -240px;
        z-index: 40;
        pointer-events: none;
        animation: eagleFlyover 4.2s cubic-bezier(.2,.65,.2,1) forwards;
        filter: drop-shadow(0 20px 30px rgba(0,0,0,0.35));
      }

      .fireworks-canvas {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 50;
      }

      @keyframes waveStripe {
        0%, 100% {
          transform: translateX(0) skewY(-1.5deg);
        }
        50% {
          transform: translateX(-35px) skewY(1.5deg);
        }
      }

      @keyframes starPulse {
        0%, 100% {
          opacity: 0.55;
          transform: scale(0.9);
        }
        50% {
          opacity: 1;
          transform: scale(1.2);
        }
      }

      @keyframes floatStar {
        0%, 100% {
          opacity: 0.18;
          transform: translateY(0) rotate(0deg);
        }
        50% {
          opacity: 0.75;
          transform: translateY(-24px) rotate(22deg);
        }
      }

      @keyframes beamMove {
        0%, 100% {
          transform: translateX(-40px) rotate(22deg);
          opacity: 0.2;
        }
        50% {
          transform: translateX(55px) rotate(22deg);
          opacity: 0.55;
        }
      }

      @keyframes envelopeFloat {
        0%, 100% {
          transform: translateY(0) rotate(-1deg);
        }
        50% {
          transform: translateY(-13px) rotate(1deg);
        }
      }

      @keyframes sealPulse {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          transform: translate(-50%, -50%) scale(1.08);
        }
      }

      @keyframes sceneIn {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes cardReveal {
        from {
          opacity: 0;
          transform: translateY(80px) scale(0.9) rotateX(12deg);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1) rotateX(0);
        }
      }

      @keyframes leftWing {
        0%, 100% {
          transform: rotate(0deg);
        }
        50% {
          transform: rotate(-10deg);
        }
      }

      @keyframes rightWing {
        0%, 100% {
          transform: rotate(0deg);
        }
        50% {
          transform: rotate(10deg);
        }
      }

      @keyframes sadLeftWing {
        to {
          transform: rotate(24deg);
        }
      }

      @keyframes sadRightWing {
        to {
          transform: rotate(-24deg);
        }
      }

      @keyframes tearFall {
        0% {
          opacity: 0;
          transform: translateY(0);
        }
        25% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: translateY(28px);
        }
      }

      @keyframes eagleFlyover {
        0% {
          transform: translateX(0) translateY(30px) scale(0.78) rotate(-4deg);
        }
        45% {
          transform: translateX(55vw) translateY(-65px) scale(1.25) rotate(2deg);
        }
        100% {
          transform: translateX(125vw) translateY(20px) scale(0.9) rotate(7deg);
        }
      }

      @media (max-width: 620px) {
        .party-page {
          padding: 22px 12px;
        }

        .blue-field {
          width: 74vw;
          height: 35vh;
        }

        .envelope-button {
          height: 260px;
        }

        .envelope-body {
          height: 205px;
        }

        .envelope-flap {
          bottom: 118px;
          height: 128px;
        }

        .seal {
          top: 134px;
          width: 82px;
          height: 82px;
        }

        .letter-preview {
          height: 150px;
        }

        .card-header {
          padding: 28px 18px 24px;
        }

        .details {
          padding: 20px;
        }

        .rsvp-panel {
          margin: 0 20px 20px;
          padding: 20px;
        }

        .rsvp-buttons {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}