import { ChevronRight, Dumbbell, Footprints, Play, Salad } from 'lucide-react';
import { NUTRITION } from '../nutrition';
import { GROUPS, REST_DAY_NOTE } from '../routine';
import { navigate } from '../router';
import { sessionHasData, sortedSessions, weekTotals } from '../stats';
import { dayType, getRoutine, isMealEaten, startSession, useAppState } from '../store';
import { addDays, cycleWeek, fmtLong, fmtShort, fmtVolume, mondayOf, todayISO } from '../utils';
import { GroupChip, Ring } from '../components/ui';

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export default function Home() {
  const state = useAppState();
  const routine = getRoutine(state);
  const today = todayISO();
  const monday = mondayOf(today);
  const week = cycleWeek(state.settings.cycleStart, today, routine.cycleWeeks);
  const thisWeek = weekTotals(state.sessions, monday);
  const lastWeek = weekTotals(state.sessions, addDays(monday, -7));
  const goal = routine.days.length;
  const delta = lastWeek.volume ? Math.round(((thisWeek.volume - lastWeek.volume) / lastWeek.volume) * 100) : null;

  const sessions = sortedSessions(state.sessions);
  const open = sessions.find((s) => !s.finishedAt && s.date === today);
  const lastDone = sessions.find((s) => s.finishedAt || sessionHasData(s));
  const lastIdx = lastDone ? routine.days.findIndex((d) => d.id === lastDone.dayId) : -1;
  const next = routine.days[(lastIdx + 1) % routine.days.length];
  const trainedToday = sessions.some((s) => s.date === today && sessionHasData(s));

  const nutriType = dayType(state, today) ?? 'pesas';
  const nutriPlan = NUTRITION.plans[nutriType];
  const mealsEaten = nutriPlan.meals.filter((m) => isMealEaten(state, today, nutriType, m.id)).length;

  const lastDateOf =(dayId) => sessions.find((s) => s.dayId === dayId && (s.finishedAt || sessionHasData(s)))?.date;
  const begin = (dayId) => navigate(`/sesion/${startSession(dayId, week)}`);

  return (
    <div className="page">
      <header className="hello">
        <p className="muted cap">{fmtLong(today)}</p>
        <h1>¡Vamos a por ello!</h1>
      </header>

      <section className="card hero">
        <Ring value={thisWeek.days.size} max={goal} size={124} stroke={13}>
          <strong>{thisWeek.days.size}</strong>
          <span>de {goal}</span>
        </Ring>
        <div className="hero-info">
          <span className="pill">Semana {week} de {routine.cycleWeeks}</span>
          <div className="stat">
            <span className="muted">Volumen esta semana</span>
            <strong>{fmtVolume(thisWeek.volume)}</strong>
            {delta != null && (
              <span className={`delta ${delta >= 0 ? 'up' : 'down'}`}>
                {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)} % vs semana pasada
              </span>
            )}
          </div>
        </div>
        <div className="weekstrip">
          {WEEKDAYS.map((l, i) => {
            const iso = addDays(monday, i);
            return (
              <div key={l} className={`wd ${thisWeek.days.has(iso) ? 'on' : ''} ${iso === today ? 'today' : ''}`}>
                <span>{l}</span>
                <i />
              </div>
            );
          })}
        </div>
      </section>

      {open ? (
        <button className="cta" onClick={() => navigate(`/sesion/${open.id}`)}>
          <div className="cta-icon"><Play size={20} fill="currentColor" /></div>
          <div>
            <span>Continuar entrenamiento</span>
            <strong>{routine.days.find((d) => d.id === open.dayId)?.title}</strong>
          </div>
          <ChevronRight />
        </button>
      ) : (
        <button className="cta" onClick={() => begin(next.id)}>
          <div className="cta-icon"><Play size={20} fill="currentColor" /></div>
          <div>
            <span>{trainedToday ? 'Otro entrenamiento' : 'Toca hoy'} · {next.name}</span>
            <strong>{next.title}</strong>
          </div>
          <ChevronRight />
        </button>
      )}

      <button className="card nutri-cta" onClick={() => navigate('/dieta')}>
        <div className="day-badge">
          <Salad size={20} />
        </div>
        <div>
          <span className="muted small">Dieta de hoy · {nutriPlan.label.toLowerCase()}</span>
          <strong>{mealsEaten} de {nutriPlan.meals.length} comidas</strong>
        </div>
        <ChevronRight size={18} className="muted" />
      </button>

      <h2 className="section-title">Tu rutina</h2>
      <div className="days">
        {routine.days.map((day) => {
          const color = GROUPS[day.groups[0]]?.color;
          const count = day.blocks.reduce((a, b) => a + b.exercises.length, 0);
          const last = lastDateOf(day.id);
          return (
            <button key={day.id} className="card day" style={{ '--c': color }} onClick={() => begin(day.id)}>
              <div className="day-badge">
                <Dumbbell size={20} />
              </div>
              <div className="day-info">
                <span className="muted small">{day.name} · {count} ejercicios</span>
                <strong>{day.title}</strong>
                <div className="chips">
                  {day.groups.map((g) => <GroupChip key={g} group={g} />)}
                </div>
              </div>
              <div className="day-last">
                {last ? <><span>Último</span><strong>{fmtShort(last)}</strong></> : <span>Nuevo</span>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="card restday">
        <Footprints size={22} />
        <p>{REST_DAY_NOTE}</p>
      </div>
    </div>
  );
}
