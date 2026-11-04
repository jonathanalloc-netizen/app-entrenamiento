import { useState } from 'react';
import { ArrowLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { GROUPS, allExercises } from '../routine';
import { goBack, navigate } from '../router';
import { filledSets, weeklyExercise } from '../stats';
import { getRoutine, useAppState } from '../store';
import { fmtNum, fmtShort, fmtVolume } from '../utils';
import { Empty, LineChart, Sparkline } from '../components/ui';

const METRICS = {
  maxW: { label: 'Peso máx.', fmt: (v) => `${fmtNum(v)} kg` },
  e1rm: { label: '1RM est.', fmt: (v) => `${fmtNum(v, 0)} kg` },
  volume: { label: 'Volumen', fmt: (v) => fmtVolume(v) },
  reps: { label: 'Reps', fmt: (v) => fmtNum(v, 0) },
};

const mainMetric = (ex) => (ex.noWeight ? 'reps' : 'maxW');

export default function Progress({ exId }) {
  const state = useAppState();
  const routine = getRoutine(state);
  const exercises = allExercises(routine);
  const ex = exId && exercises.find((e) => e.id === exId);
  if (ex) return <ExerciseDetail ex={ex} sessions={state.sessions} />;

  const anyData = state.sessions.some((s) => Object.keys(s.sets).length);

  return (
    <div className="page">
      <header className="hello">
        <p className="muted">Progresión semanal</p>
        <h1>Progreso</h1>
      </header>
      {!anyData && (
        <Empty icon={TrendingUp} title="Aún no hay datos">
          Registra tu primer entrenamiento y aquí verás cómo evolucionan tus pesos semana a semana.
        </Empty>
      )}
      {routine.days.map((day) => (
        <section key={day.id}>
          <h2 className="section-title">{day.name} · {day.title}</h2>
          <div className="card list">
            {exercises
              .filter((e) => e.day.id === day.id)
              .map((e) => {
                const weeks = weeklyExercise(state.sessions, e.id);
                const m = mainMetric(e);
                const vals = weeks.map((w) => w[m]);
                const last = weeks.at(-1);
                const prev = weeks.at(-2);
                const diff = last && prev && last[m] != null && prev[m] != null ? last[m] - prev[m] : null;
                return (
                  <button key={e.id} className="row" onClick={() => navigate(`/progreso/${e.id}`)}>
                    <i className="dot" style={{ background: GROUPS[e.group]?.color }} />
                    <div className="row-main">
                      <strong>{e.name}</strong>
                      <span className="muted small">
                        {last ? `${METRICS[m].fmt(last[m])} · semana del ${fmtShort(last.week)}` : 'Sin registros'}
                      </span>
                    </div>
                    <Sparkline values={vals} color={GROUPS[e.group]?.color} />
                    {diff != null && diff !== 0 && (
                      <span className={`delta ${diff > 0 ? 'up' : 'down'}`}>{diff > 0 ? '+' : ''}{fmtNum(diff)}</span>
                    )}
                    <ChevronRight size={18} className="muted" />
                  </button>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}

function ExerciseDetail({ ex, sessions }) {
  const [metric, setMetric] = useState(mainMetric(ex));
  const weeks = weeklyExercise(sessions, ex.id);
  const color = GROUPS[ex.group]?.color;
  const M = METRICS[metric];
  const pts = weeks.filter((w) => w[metric] != null).map((w) => ({ label: fmtShort(w.week), value: w[metric] }));
  const best = weeks.reduce((a, w) => Math.max(a, w.maxW ?? 0), 0);
  const history = weeks.flatMap((w) => w.sessions).sort((a, b) => (a.date < b.date ? 1 : -1));
  const metrics = ex.noWeight ? ['reps'] : Object.keys(METRICS);

  return (
    <div className="page">
      <header className="topbar">
        <button className="icon-btn" onClick={() => goBack('/progreso')} aria-label="Volver">
          <ArrowLeft size={22} />
        </button>
        <div className="topbar-title">
          <span className="muted small">{ex.day.name} · {GROUPS[ex.group]?.label}</span>
          <strong>{ex.name}</strong>
        </div>
        <span style={{ width: 40 }} />
      </header>

      {!weeks.length ? (
        <Empty icon={TrendingUp} title="Sin registros todavía">
          Cuando apuntes este ejercicio en un entreno verás aquí su evolución.
        </Empty>
      ) : (
        <>
          <div className="stats3">
            <div className="card mini">
              <span className="muted small">Mejor peso</span>
              <strong>{ex.noWeight ? '—' : `${fmtNum(best)} ${ex.unit ?? 'kg'}`}</strong>
            </div>
            <div className="card mini">
              <span className="muted small">Semanas</span>
              <strong>{weeks.length}</strong>
            </div>
            <div className="card mini">
              <span className="muted small">Entrenos</span>
              <strong>{history.length}</strong>
            </div>
          </div>

          <div className="card">
            <div className="seg full">
              {metrics.map((k) => (
                <button key={k} className={k === metric ? 'on' : ''} onClick={() => setMetric(k)}>
                  {METRICS[k].label}
                </button>
              ))}
            </div>
            <LineChart points={pts} color={color} format={(v) => fmtNum(v, metric === 'maxW' ? 1 : 0)} />
          </div>

          <h2 className="section-title">Por semana</h2>
          <div className="card list">
            {[...weeks].reverse().map((w, i, arr) => {
              const prev = arr[i + 1];
              const diff = prev && w[metric] != null && prev[metric] != null ? w[metric] - prev[metric] : null;
              return (
                <div key={w.week} className="row static">
                  <div className="row-main">
                    <strong>Semana del {fmtShort(w.week)}</strong>
                    <span className="muted small">{w.count} series · {fmtVolume(w.volume)}</span>
                  </div>
                  <strong>{w[metric] != null ? M.fmt(w[metric]) : '–'}</strong>
                  {diff != null && (
                    <span className={`delta ${diff > 0 ? 'up' : diff < 0 ? 'down' : ''}`}>
                      {diff > 0 ? '+' : ''}{metric === 'volume' ? fmtVolume(diff) : fmtNum(diff)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <h2 className="section-title">Registros</h2>
          <div className="card list">
            {history.map((s) => (
              <button key={s.id} className="row" onClick={() => navigate(`/sesion/${s.id}`)}>
                <div className="row-main">
                  <strong>{fmtShort(s.date)}{s.week ? ` · S${s.week}` : ''}</strong>
                  <span className="muted small sets-line">
                    {filledSets(s, ex.id)
                      .map((r) => (r.w != null ? `${fmtNum(r.w)}×${r.r ?? '?'}` : `${r.r} reps`))
                      .join('  ·  ')}
                  </span>
                </div>
                <ChevronRight size={18} className="muted" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
