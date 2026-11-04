import { useState } from 'react';
import { ArrowLeft, Check, Info, Minus, Plus, Timer, Trash2 } from 'lucide-react';
import { BLOCK_KINDS, GROUPS, dayHasWeeks, resolveExercise } from '../routine';
import { goBack, navigate } from '../router';
import { lastPerformance, sessionHasData, sessionVolume } from '../stats';
import { addSet, deleteSession, getRoutine, removeSet, updateSession, updateSet, useAppState } from '../store';
import { startTimer } from '../timer';
import { fmtDuration, fmtLong, fmtNum, fmtRest, fmtShort, fmtVolume, todayISO } from '../utils';
import { Empty } from '../components/ui';

export default function Session({ id }) {
  const state = useAppState();
  const routine = getRoutine(state);
  const session = state.sessions.find((s) => s.id === id);
  const day = session && routine.days.find((d) => d.id === session.dayId);

  if (!session || !day)
    return (
      <div className="page">
        <Empty icon={Info} title="Entreno no encontrado">
          <button className="btn" onClick={() => navigate('/')}>Volver al inicio</button>
        </Empty>
      </div>
    );

  const week = session.week ?? 1;
  const blocks = day.blocks.map((b) => ({ ...b, exercises: b.exercises.map((e) => resolveExercise(e, b, week)) }));
  let total = 0, done = 0;
  for (const b of blocks)
    for (const e of b.exercises) {
      const rows = session.sets[e.id] ?? Array(e.sets).fill({});
      total += rows.length;
      done += rows.filter((r) => r.done).length;
    }
  const { volume } = sessionVolume(session);

  const leave = () => {
    // Un entreno abierto sin ningún dato no se guarda.
    if (!session.finishedAt && !sessionHasData(session)) deleteSession(session.id);
    goBack('/');
  };

  const finish = () => {
    updateSession(session.id, { finishedAt: Date.now() });
    navigate('/historial');
  };

  const remove = () => {
    if (confirm('¿Borrar este entrenamiento y todos sus datos?')) {
      deleteSession(session.id);
      navigate('/');
    }
  };

  return (
    <div className="page session">
      <header className="topbar">
        <button className="icon-btn" onClick={leave} aria-label="Volver">
          <ArrowLeft size={22} />
        </button>
        <div className="topbar-title">
          <span className="muted small cap">{day.name} · {fmtLong(session.date)}</span>
          <strong>{day.title}</strong>
        </div>
        <button className="icon-btn" onClick={remove} aria-label="Borrar">
          <Trash2 size={20} />
        </button>
      </header>

      <div className="card progress-card">
        <div className="progress-head">
          <span><strong>{done}</strong> / {total} series</span>
          <span className="muted">{fmtVolume(volume)}</span>
        </div>
        <div className="bar"><i style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></div>
        <div className="weeks">
          <label className="muted small" htmlFor="session-date">Fecha</label>
          <input
            id="session-date"
            type="date"
            className="date-inline"
            value={session.date}
            max={todayISO()}
            onChange={(e) => e.target.value && updateSession(session.id, { date: e.target.value })}
          />
        </div>
        {dayHasWeeks(day) && (
          <div className="weeks">
            <span className="muted small">Semana del ciclo</span>
            <div className="seg">
              {Array.from({ length: routine.cycleWeeks }, (_, i) => i + 1).map((w) => (
                <button key={w} className={w === week ? 'on' : ''} onClick={() => updateSession(session.id, { week: w })}>
                  S{w}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {blocks.map((block, bi) => (
        <Block key={bi} block={block} session={session} sessions={state.sessions} />
      ))}

      <div className="card">
        <label className="label" htmlFor="note">Notas del entreno</label>
        <textarea
          id="note"
          rows={3}
          placeholder="Sensaciones, molestias, cambios…"
          value={session.note}
          onChange={(e) => updateSession(session.id, { note: e.target.value })}
        />
      </div>

      {session.finishedAt ? (
        <p className="muted center small">
          Terminado · {fmtDuration(session.finishedAt - session.startedAt)}. Puedes seguir editando los datos.
        </p>
      ) : (
        <button className="btn primary big" onClick={finish}>
          <Check size={20} /> Finalizar entrenamiento
        </button>
      )}
    </div>
  );
}

function Block({ block, session, sessions }) {
  const [open, setOpen] = useState(false);
  const color = GROUPS[block.group]?.color;
  const kind = BLOCK_KINDS[block.kind ?? 'normal'];
  const grouped = !!kind;
  return (
    <section className={`block ${grouped ? 'grouped' : ''}`} style={{ '--c': color }}>
      <div className="block-head">
        <h2>
          <i />
          {block.title}
          {kind && <span className="tag">{kind}</span>}
        </h2>
        {(block.note || block.restText) && (
          <button className="icon-btn sm" onClick={() => setOpen(!open)} aria-label="Indicaciones">
            <Info size={18} />
          </button>
        )}
      </div>
      {open && (
        <div className="note">
          {block.note && <p>{block.note}</p>}
          {block.restText && <p><Timer size={14} /> {block.restText}</p>}
        </div>
      )}
      {block.exercises.map((ex, i) => (
        <Exercise
          key={ex.id}
          ex={ex}
          session={session}
          sessions={sessions}
          // En superseries y series gigantes el descanso va tras el último ejercicio.
          restAfterSet={!grouped || i === block.exercises.length - 1}
          rest={grouped ? block.rest : ex.rest}
        />
      ))}
    </section>
  );
}

function Exercise({ ex, session, sessions, restAfterSet, rest }) {
  const [info, setInfo] = useState(false);
  const rows = session.sets[ex.id] ?? Array.from({ length: ex.sets }, () => ({ w: '', r: '', done: false }));
  const prev = lastPerformance(sessions, ex.id, session.id);
  const prevRows = prev?.rows ?? [];
  const unit = ex.noWeight ? null : ex.unit ?? 'kg';
  const set = (idx, patch) => updateSet(session.id, ex.id, ex.sets, idx, patch);

  const toggle = (idx) => {
    const row = rows[idx];
    if (row.done) return set(idx, { done: false });
    const p = prevRows[idx] ?? {};
    set(idx, { done: true, w: row.w || p.w || '', r: row.r || p.r || '' });
    if (restAfterSet) startTimer(rest, ex.name);
  };

  const prevSummary = prevRows
    .filter((r) => r.w || r.r)
    .map((r) => (r.w ? `${fmtNum(+String(r.w).replace(',', '.'))}×${r.r || '?'}` : `${r.r} reps`))
    .join(' · ');

  return (
    <div className="card exercise">
      <div className="ex-head">
        <div>
          <h3>{ex.name}</h3>
          {ex.from && <span className="muted small">Desde la pasada {ex.from}</span>}
        </div>
        {ex.notes && (
          <button className={`icon-btn sm ${info ? 'on' : ''}`} onClick={() => setInfo(!info)} aria-label="Notas">
            <Info size={18} />
          </button>
        )}
      </div>
      <p className="target">{ex.target}</p>
      {info && <p className="note">{ex.notes}</p>}
      <div className="ex-meta">
        {restAfterSet && (
          <button className="rest-chip" onClick={() => startTimer(rest, ex.name)}>
            <Timer size={14} /> {fmtRest(rest)}
          </button>
        )}
        {restAfterSet && ex.restText && <span className="muted small">{ex.restText}</span>}
      </div>
      {prevSummary && (
        <p className="prev">
          <span>Anterior ({fmtShort(prev.session.date)})</span> {prevSummary}
        </p>
      )}

      <div className={`sets ${unit ? '' : 'no-weight'}`}>
        <div className="sets-head">
          <span>Serie</span>
          {unit && <span>{unit}</span>}
          <span>Reps</span>
          <span />
        </div>
        {rows.map((row, idx) => {
          const p = prevRows[idx] ?? {};
          return (
            <div key={idx} className={`set ${row.done ? 'done' : ''}`}>
              <span className="set-n">{idx + 1}</span>
              {unit && (
                <input
                  inputMode="decimal"
                  placeholder={p.w || '–'}
                  value={row.w}
                  onChange={(e) => set(idx, { w: e.target.value })}
                  aria-label={`Peso serie ${idx + 1}`}
                />
              )}
              <input
                inputMode="numeric"
                placeholder={p.r || '–'}
                value={row.r}
                onChange={(e) => set(idx, { r: e.target.value })}
                aria-label={`Repeticiones serie ${idx + 1}`}
              />
              <button className="check" onClick={() => toggle(idx)} aria-label="Serie hecha">
                <Check size={18} strokeWidth={3} />
              </button>
            </div>
          );
        })}
      </div>
      <div className="set-actions">
        <button onClick={() => removeSet(session.id, ex.id, ex.sets)} disabled={rows.length <= 1}>
          <Minus size={16} /> Quitar serie
        </button>
        <button onClick={() => addSet(session.id, ex.id, ex.sets)}>
          <Plus size={16} /> Añadir serie
        </button>
      </div>
    </div>
  );
}
