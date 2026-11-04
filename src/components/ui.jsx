import { useEffect, useId, useState } from 'react';
import { CalendarDays, House, Salad, Settings, TrendingUp, X } from 'lucide-react';
import { GROUPS } from '../routine';
import { navigate } from '../router';
import { addTime, alarm, stopTimer, useTimer } from '../timer';
import { fmtClock } from '../utils';

export function Ring({ value, max, size = 120, stroke = 12, color = 'var(--primary)', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max ? Math.min(1, value / max) : 0;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset .6s ease' }}
        />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
}

export function GroupChip({ group }) {
  const g = GROUPS[group];
  if (!g) return null;
  return (
    <span className="chip" style={{ '--c': g.color }}>
      <i />
      {g.label}
    </span>
  );
}

export function Sparkline({ values, color = 'var(--primary)', width = 72, height = 28 }) {
  const pts = values.filter((v) => v != null);
  if (pts.length < 2) return <div style={{ width, height }} />;
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const span = max - min || 1;
  const d = pts
    .map((v, i) => `${i ? 'L' : 'M'}${(i / (pts.length - 1)) * (width - 4) + 2},${height - 3 - ((v - min) / span) * (height - 6)}`)
    .join(' ');
  return (
    <svg width={width} height={height} className="spark">
      <path d={d} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LineChart({ points, color = 'var(--primary)', format = (v) => v }) {
  const gid = useId().replace(/:/g, '');
  const W = 340, H = 180, pl = 8, pr = 8, pt = 26, pb = 26;
  if (!points.length) return null;
  const vals = points.map((p) => p.value);
  let min = Math.min(...vals);
  let max = Math.max(...vals);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const pad = (max - min) * 0.15;
  min -= pad;
  max += pad;
  const x = (i) => (points.length === 1 ? W / 2 : pl + (i / (points.length - 1)) * (W - pl - pr));
  const y = (v) => pt + (1 - (v - min) / (max - min)) * (H - pt - pb);
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.value)}`).join(' ');
  const area = `${line} L${x(points.length - 1)},${H - pb} L${x(0)},${H - pb} Z`;
  const every = Math.ceil(points.length / 6);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((f) => (
        <line key={f} x1={pl} x2={W - pr} y1={pt + f * (H - pt - pb)} y2={pt + f * (H - pt - pb)} stroke="var(--line)" strokeDasharray="3 5" />
      ))}
      {points.length > 1 && <path d={area} fill={`url(#${gid})`} />}
      {points.length > 1 && <path d={line} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      {points.map((p, i) => {
        const last = i === points.length - 1;
        return (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.value)} r={last ? 6 : 4} fill={last ? color : 'var(--card)'} stroke={color} strokeWidth="2.5" />
            {(last || points.length <= 4) && (
              <text x={x(i)} y={y(p.value) - 12} textAnchor="middle" className="chart-val">
                {format(p.value)}
              </text>
            )}
            {(i % every === 0 || last) && (
              <text x={x(i)} y={H - 6} textAnchor="middle" className="chart-x">
                {p.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

const TABS = [
  { name: 'hoy', path: '/', label: 'Hoy', Icon: House },
  { name: 'dieta', path: '/dieta', label: 'Dieta', Icon: Salad },
  { name: 'progreso', path: '/progreso', label: 'Progreso', Icon: TrendingUp },
  { name: 'historial', path: '/historial', label: 'Historial', Icon: CalendarDays },
  { name: 'ajustes', path: '/ajustes', label: 'Ajustes', Icon: Settings },
];

export function TabBar({ active }) {
  return (
    <nav className="tabbar">
      {TABS.map(({ name, path, label, Icon }) => (
        <button key={name} className={active === name ? 'on' : ''} onClick={() => navigate(path)}>
          <Icon size={22} strokeWidth={active === name ? 2.4 : 2} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export function RestTimer() {
  const timer = useTimer();
  const [now, setNow] = useState(Date.now());
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!timer) return;
    setDone(false);
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [timer]);

  const left = timer ? (timer.endAt - now) / 1000 : 0;

  useEffect(() => {
    if (timer && left <= 0) {
      alarm();
      stopTimer();
      setDone(true);
      const t = setTimeout(() => setDone(false), 3500);
      return () => clearTimeout(t);
    }
  }, [timer, left]);

  if (done)
    return (
      <div className="timer done" onClick={() => setDone(false)}>
        <strong>¡Descanso terminado!</strong>
        <span>A por la siguiente serie</span>
      </div>
    );
  if (!timer) return null;

  const pct = Math.max(0, Math.min(1, left / timer.total));
  return (
    <div className="timer">
      <Ring value={pct} max={1} size={46} stroke={5} color="#fff">
        <span />
      </Ring>
      <div className="timer-main">
        <strong>{fmtClock(left)}</strong>
        <span>{timer.label || 'Descanso'}</span>
      </div>
      <button onClick={() => addTime(-15)}>−15</button>
      <button onClick={() => addTime(15)}>+15</button>
      <button className="icon" onClick={stopTimer} aria-label="Parar">
        <X size={18} />
      </button>
    </div>
  );
}

export function Empty({ icon: Icon, title, children }) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon size={28} />
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
