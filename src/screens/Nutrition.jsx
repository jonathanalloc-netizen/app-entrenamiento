import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Dumbbell, Footprints, Pill } from 'lucide-react';
import { NUTRITION } from '../nutrition';
import { REST_DAY_NOTE } from '../routine';
import { dayType, setDayType, setMealOption, toggleMeal, toggleSupplement, useAppState } from '../store';
import { addDays, daysBetween, fmtLong, todayISO } from '../utils';
import { Ring } from '../components/ui';

const TYPES = [
  { id: 'pesas', Icon: Dumbbell },
  { id: 'descanso', Icon: Footprints },
];

export default function Nutrition() {
  const state = useAppState();
  const today = todayISO();
  const [date, setDate] = useState(today);
  const type = dayType(state, date) ?? 'pesas';
  const plan = NUTRITION.plans[type];
  const day = state.nutrition?.[date] ?? {};
  const eaten = plan.meals.filter((m) => day.eaten?.[m.id]).length;
  const offset = daysBetween(today, date);
  const relative = offset === 0 ? 'Hoy' : offset === 1 ? 'Mañana' : offset === -1 ? 'Ayer' : null;

  return (
    <div className="page">
      <header className="hello">
        <p className="muted">{NUTRITION.summary}</p>
        <h1>Dieta</h1>
      </header>

      <div className="daynav">
        <button className="icon-btn" onClick={() => setDate(addDays(date, -1))} aria-label="Día anterior">
          <ChevronLeft size={20} />
        </button>
        <button className="daynav-label" onClick={() => setDate(today)}>
          <strong>{relative ?? fmtLong(date).split(',')[0]}</strong>
          <span className="muted small cap">{fmtLong(date)}</span>
        </button>
        <button className="icon-btn" onClick={() => setDate(addDays(date, 1))} aria-label="Día siguiente">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="typepick">
        {TYPES.map(({ id, Icon }) => (
          <button key={id} className={type === id ? 'on' : ''} onClick={() => setDayType(date, id)}>
            <Icon size={20} />
            <span>{NUTRITION.plans[id].label}</span>
          </button>
        ))}
      </div>

      <section className="card hero nutri">
        <Ring value={eaten} max={plan.meals.length} size={110} stroke={12} color="var(--orange)">
          <strong>{eaten}</strong>
          <span>de {plan.meals.length}</span>
        </Ring>
        <div className="hero-info">
          <span className="pill orange">{plan.label}</span>
          <span className="muted small">comidas hechas</span>
          {NUTRITION.supplements.map((s) => (
            <button
              key={s.id}
              className={`supp ${day.supplements?.[s.id] ? 'on' : ''}`}
              onClick={() => toggleSupplement(date, s.id)}
            >
              <Pill size={16} />
              <span><strong>{s.name}</strong> · {s.amount}</span>
              <i><Check size={14} strokeWidth={3} /></i>
            </button>
          ))}
        </div>
      </section>

      {type === 'descanso' && (
        <div className="card restday">
          <Footprints size={22} />
          <p>{REST_DAY_NOTE}</p>
        </div>
      )}

      {plan.meals.map((meal, idx) => {
        const opt = Math.min(day.option?.[meal.id] ?? 0, meal.options.length - 1);
        const done = !!day.eaten?.[meal.id];
        return (
          <div key={meal.id} className={`card meal ${done ? 'done' : ''}`}>
            <div className="meal-head">
              <span className="meal-n">{idx + 1}</span>
              <h3>{meal.name}</h3>
              <button className="check" onClick={() => toggleMeal(date, meal.id)} aria-label={`${meal.name} hecha`}>
                <Check size={18} strokeWidth={3} />
              </button>
            </div>
            {meal.options.length > 1 && (
              <div className="seg full">
                {meal.options.map((_, o) => (
                  <button key={o} className={o === opt ? 'on' : ''} onClick={() => setMealOption(date, meal.id, o)}>
                    Opción {o + 1}
                  </button>
                ))}
              </div>
            )}
            <ul className="foods">
              {meal.options[opt].map((f, k) => (
                <li key={k}>
                  {f.qty && <strong>{f.qty}</strong>}
                  <span>{f.food}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <div className="tips">
        {NUTRITION.tips.map((t) => (
          <span key={t} className="tip">{t}</span>
        ))}
      </div>
    </div>
  );
}
