
export function initDynamicBackground() {
  const style = document.createElement('style');
  style.textContent = `
    body {
      position: relative;
      overflow-x: hidden;
      background: var(--bg) !important;
    }

    body::before, body::after {
      content: "";
      position: fixed;
      top: -100%;
      left: -100%;
      width: 300%;
      height: 300%;
      z-index: -1;
      background: radial-gradient(circle at center, var(--bubble) 0%, transparent 70%);
      opacity: 0.6;
      pointer-events: none;
      filter: blur(60px);
    }

    body::before {
      animation: moveClouds 40s ease-in-out infinite;
    }

    body::after {
      animation: moveClouds 60s ease-in-out infinite reverse;
      opacity: 0.3;
      background: radial-gradient(circle at center, var(--primary) 0%, transparent 60%);
    }

    @keyframes moveClouds {
      0% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(5%, 10%) scale(1.1);
      }
      66% {
        transform: translate(-5%, 5%) scale(0.9);
      }
      100% {
        transform: translate(0, 0) scale(1);
      }
    }
  `;
  document.head.appendChild(style);
}
