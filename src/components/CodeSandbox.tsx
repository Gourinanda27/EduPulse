import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Layout, 
  Terminal,
  Layers,
  Copy,
  Check
} from 'lucide-react';

interface CodeSandboxProps {
  initialCode?: string;
  showToast: (msg: string) => void;
}

const PRESETS = [
  {
    name: 'Attention Matrix Heatmap',
    description: 'Visualizes Query x Key dot-product attention scores in real-time.',
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #0f172a; color: #fff; padding: 20px; }
    h3 { margin-top: 0; color: #818cf8; }
    .matrix-grid { display: grid; grid-template-columns: repeat(4, 60px); gap: 6px; margin: 15px 0; }
    .cell {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      font-weight: bold;
      font-size: 12px;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .tokens { display: flex; gap: 8px; margin-bottom: 12px; }
    .token-pill { background: #1e293b; padding: 4px 10px; border-radius: 999px; font-size: 13px; border: 1px solid #334155; }
    button { background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
  </style>
</head>
<body>
  <h3>Self-Attention Softmax Heatmap</h3>
  <div class="tokens">
    <span class="token-pill">1: The</span>
    <span class="token-pill">2: river</span>
    <span class="token-pill">3: bank</span>
    <span class="token-pill">4: water</span>
  </div>
  <div class="matrix-grid" id="grid"></div>
  <button onclick="randomize()">Simulate Attention Pass</button>

  <script>
    const tokens = ["The", "river", "bank", "water"];
    const grid = document.getElementById("grid");

    function render(weights) {
      grid.innerHTML = "";
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const val = weights[i][j];
          const cell = document.createElement("div");
          cell.className = "cell";
          const opacity = Math.max(0.15, val);
          cell.style.background = \`rgba(99, 102, 241, \${opacity})\`;
          cell.style.border = val > 0.4 ? "2px solid #a855f7" : "1px solid #334155";
          cell.innerText = (val * 100).toFixed(0) + "%";
          cell.title = \`Query '\${tokens[i]}' -> Key '\${tokens[j]}': \${(val*100).toFixed(1)}%\`;
          grid.appendChild(cell);
        }
      }
    }

    function randomize() {
      const w = [];
      for (let i = 0; i < 4; i++) {
        let row = [Math.random(), Math.random(), Math.random(), Math.random()];
        // Make "river" and "bank" attend strongly
        if (i === 2) row[1] += 1.8;
        if (i === 1) row[3] += 1.5;
        const sum = row.reduce((a, b) => a + b, 0);
        w.push(row.map(v => v / sum));
      }
      render(w);
    }

    randomize();
  </script>
</body>
</html>`
  },
  {
    name: 'Euler Complex Plane Unit Circle',
    description: 'Rotates e^(i * theta) along the unit circle showing cos(x) + i*sin(x).',
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #0b0f19; color: #fff; margin: 0; padding: 20px; text-align: center; }
    canvas { background: #111827; border-radius: 12px; border: 1px solid #374151; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
    .stats { margin-top: 10px; font-family: monospace; color: #38bdf8; font-size: 14px; }
  </style>
</head>
<body>
  <h3 style="color: #818cf8; margin: 0 0 10px 0;">e^(i * &theta;) = cos(&theta;) + i&sdot;sin(&theta;)</h3>
  <canvas id="cv" width="300" height="300"></canvas>
  <div class="stats" id="stats"></div>

  <script>
    const cv = document.getElementById("cv");
    const ctx = cv.getContext("2d");
    const stats = document.getElementById("stats");
    let theta = 0;

    function draw() {
      ctx.clearRect(0, 0, 300, 300);
      const cx = 150, cy = 150, r = 110;

      // Axes
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, cy); ctx.lineTo(280, cy);
      ctx.moveTo(cx, 20); ctx.lineTo(cx, 280);
      ctx.stroke();

      // Unit Circle
      ctx.strokeStyle = "#4b5563";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Current point
      const x = cx + r * Math.cos(theta);
      const y = cy - r * Math.sin(theta);

      // Vector
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Vector point
      ctx.fillStyle = "#ec4899";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Cosine projection (real)
      ctx.strokeStyle = "#10b981";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, cy);
      ctx.stroke();

      // Sine projection (imaginary)
      ctx.strokeStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(x, cy);
      ctx.lineTo(x, y);
      ctx.stroke();

      stats.innerText = \`&theta; = \${(theta % (Math.PI*2)).toFixed(2)} rad | Real = \${Math.cos(theta).toFixed(2)} | Imag = \${Math.sin(theta).toFixed(2)}i\`;

      theta += 0.025;
      requestAnimationFrame(draw);
    }
    draw();
  </script>
</body>
</html>`
  },
  {
    name: 'Binary Search Step-by-Step',
    description: 'Interactive visualization cutting 16-element search space by half.',
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #0f172a; color: #fff; padding: 20px; text-align: center; }
    .array-wrap { display: flex; justify-content: center; gap: 4px; margin: 20px 0; flex-wrap: wrap; }
    .box {
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      background: #1e293b; border: 1px solid #334155;
      border-radius: 4px; font-weight: bold; font-size: 13px;
      transition: all 0.2s;
    }
    .eliminated { opacity: 0.2; background: #0f172a; }
    .mid { background: #f59e0b; border-color: #fbbf24; color: #000; transform: scale(1.1); }
    .found { background: #10b981; border-color: #34d399; color: #000; transform: scale(1.15); }
    button { background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
    .log { font-family: monospace; color: #94a3b8; margin-top: 15px; font-size: 13px; }
  </style>
</head>
<body>
  <h3 style="color: #818cf8; margin: 0;">Binary Search O(log n)</h3>
  <p style="font-size: 14px; color: #94a3b8;">Target Value: <strong style="color: #38bdf8;" id="targetVal">47</strong></p>
  <div class="array-wrap" id="arr"></div>
  <button id="btn" onclick="step()">Step Next Comparison</button>
  <div class="log" id="log">Click step to start.</div>

  <script>
    const items = [2, 5, 8, 12, 16, 23, 38, 47, 56, 72, 81, 93, 104, 118, 132, 150];
    const target = 47;
    let L = 0, R = items.length - 1;
    let finished = false;

    function render(mid = -1) {
      const container = document.getElementById("arr");
      container.innerHTML = "";
      items.forEach((val, idx) => {
        const div = document.createElement("div");
        div.className = "box";
        div.innerText = val;
        if (idx < L || idx > R) div.classList.add("eliminated");
        if (idx === mid) {
          div.classList.add(val === target ? "found" : "mid");
        }
        container.appendChild(div);
      });
    }

    function step() {
      if (finished) {
        L = 0; R = items.length - 1; finished = false;
        document.getElementById("btn").innerText = "Step Next Comparison";
        render();
        document.getElementById("log").innerText = "Restarted.";
        return;
      }

      if (L <= R) {
        const mid = Math.floor((L + R) / 2);
        render(mid);
        if (items[mid] === target) {
          document.getElementById("log").innerText = \`Found \${target} at index \${mid}! Total operations: logarithmic.\`;
          finished = true;
          document.getElementById("btn").innerText = "Reset";
        } else if (items[mid] < target) {
          document.getElementById("log").innerText = \`\${items[mid]} < \${target} -> Discarding left half (indices \${L}..\${mid})\`;
          L = mid + 1;
        } else {
          document.getElementById("log").innerText = \`\${items[mid]} > \${target} -> Discarding right half (indices \${mid}..\${R})\`;
          R = mid - 1;
        }
      }
    }

    render();
  </script>
</body>
</html>`
  }
];

export const CodeSandbox: React.FC<CodeSandboxProps> = ({ initialCode, showToast }) => {
  const [code, setCode] = useState(initialCode || PRESETS[0].code);
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  useEffect(() => {
    if (initialCode) {
      // If code was passed in from a reader snippet, wrap it nicely if needed
      if (!initialCode.includes('<!DOCTYPE') && !initialCode.includes('<html')) {
        setCode(`<!DOCTYPE html>
<html>
<head>
  <style>body { font-family: monospace; background: #0f172a; color: #f8fafc; padding: 20px; }</style>
</head>
<body>
  <h3>Output from article:</h3>
  <pre id="output"></pre>
  <script>
    try {
      ${initialCode}
    } catch(err) {
      document.getElementById('output').innerText = 'Execution note: ' + err.message;
    }
  </script>
</body>
</html>`);
      } else {
        setCode(initialCode);
      }
    }
  }, [initialCode]);

  const handleSelectPreset = (index: number) => {
    setActivePresetIndex(index);
    setCode(PRESETS[index].code);
    showToast(`Loaded "${PRESETS[index].name}" preset.`);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    showToast('Code copied to clipboard!');
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2rem auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '999px',
          background: 'var(--accent-primary-light)',
          color: 'var(--accent-primary)',
          fontSize: '0.8rem',
          fontWeight: '600',
          marginBottom: '0.75rem'
        }}>
          <Code size={15} />
          <span>Interactive Computer Lab & Playground</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Educational Simulation Lab
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Run, tweak, and test live interactive scientific simulations and algorithms directly in your browser.
        </p>

        {/* Preset Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
          {PRESETS.map((preset, idx) => (
            <button
              key={preset.name}
              onClick={() => handleSelectPreset(idx)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: activePresetIndex === idx ? '700' : '500',
                background: activePresetIndex === idx ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: activePresetIndex === idx ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-light)',
                transition: 'all 0.2s'
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Preview Split View */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)'
      }}>
        
        {/* Code Editor Pane */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-light)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.25rem',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={16} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                Editor (HTML / CSS / JS)
              </span>
            </div>

            <button 
              onClick={handleCopyCode}
              className="btn btn-ghost"
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              title="Copy code"
            >
              <Copy size={13} />
              <span>Copy</span>
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              flex: 1,
              minHeight: '380px',
              padding: '1rem',
              background: '#0d1117',
              color: '#58a6ff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              lineHeight: '1.6',
              border: 'none',
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>

        {/* Live Preview Pane */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.25rem',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={16} color="#10b981" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                Live Execution Sandbox
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Active
            </span>
          </div>

          <iframe
            srcDoc={code}
            title="Live Sandbox Output"
            sandbox="allow-scripts"
            style={{
              flex: 1,
              width: '100%',
              minHeight: '380px',
              border: 'none',
              background: '#0f172a'
            }}
          />
        </div>

      </div>

    </div>
  );
};
