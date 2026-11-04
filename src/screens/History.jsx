import { CalendarDays, ChevronRight } from 'lucide-react';
import { GROUPS } from '../routine';
import { navigate } from '../router';
import { sessionHasData, sessionVolume, sortedSessions } from '../stats';
import { getRoutine, useAppState } from '../store';
import { fmtDuration, fmtLong, fmtMonth, fmtVolume } from '../utils';
import { Empty } from '../components/ui';

export default function History() {
  const state = useAppState();
  const routine = getRoutine(state);
  const sessions = sortedSessions(state.sessions).filter((s) => s.finishedAt || sessionHasData(s));

  const months = [];
  for (const s of sessions) {
    const key = s.date.slice(0, 7);
    if (months.at(-1)?.key !== key) months.push({ key, list: [] });
    months.at(-1).list.push(s);
  }

  return (
    <div className="page">
      <header className="hello">
        <p className="muted">{sessions.length} entrenamientos</p>
        <h1>Historial</h1>
      </header>
      {!sessions.length && (
        <Empty icon={CalendarDays} title="Todavía no has entrenado">
          Tus entrenamientos aparecerán aquí. Puedes abrir cualquiera para revisarlo o corregir datos.
        </Empty>
      )}
      {months.map((m) => (
        <section key={m.key}>
          <h2 className="section-title cap">{fmtMonth(`${m.key}-01`)}</h2>
          <div className="card list">
            {m.list.map((s) => {
              const day = routine.days.find((d) => d.id === s.dayId);
              const { volume, sets } = sessionVolume(s);
              return (
                <button key={s.id} className="row" onClick={() => navigate(`/sesion/${s.id}`)}>
                  <i className="dot big" style={{ background: GROUPS[day?.groups[0]]?.color }} />
                  <div className="row-main">
                    <strong>{day ? `${day.name} · ${day.title}` : 'Entreno'}</strong>
                    <span className="muted small cap">
                      {fmtLong(s.date)} · {sets} series · {fmtVolume(volume)}
                      {s.finishedAt ? ` · ${fmtDuration(s.finishedAt - s.startedAt)}` : ' · en curso'}
                    </span>
                  </div>
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
