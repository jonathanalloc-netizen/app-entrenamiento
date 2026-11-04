import { useEffect, useRef, useState } from 'react';
import { Download, RotateCcw, Smartphone, Upload } from 'lucide-react';
import { exportData, getRoutine, importData, resetAll, setSettings, useAppState } from '../store';
import { cycleWeek, mondayOf, todayISO } from '../utils';

let installPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installPrompt = e;
});

export default function Settings() {
  const state = useAppState();
  const routine = getRoutine(state);
  const week = cycleWeek(state.settings.cycleStart, todayISO(), routine.cycleWeeks);
  const fileRef = useRef();
  const [msg, setMsg] = useState('');
  const [persisted, setPersisted] = useState(null);
  const [canInstall, setCanInstall] = useState(!!installPrompt);

  useEffect(() => {
    navigator.storage?.persisted?.().then(setPersisted);
    const onPrompt = () => setCanInstall(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const flash = (t) => {
    setMsg(t);
    setTimeout(() => setMsg(''), 3000);
  };

  const download = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `entreno-copia-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!confirm('Esto sustituirá todos los datos actuales por los de la copia. ¿Continuar?')) return;
    try {
      importData(await file.text());
      flash('Copia restaurada correctamente');
    } catch (err) {
      flash(err.message || 'No se pudo leer el archivo');
    }
  };

  const install = async () => {
    await installPrompt?.prompt();
    installPrompt = null;
    setCanInstall(false);
  };

  return (
    <div className="page">
      <header className="hello">
        <p className="muted">{routine.name}</p>
        <h1>Ajustes</h1>
      </header>

      <h2 className="section-title">Ciclo de {routine.cycleWeeks} semanas</h2>
      <div className="card">
        <p className="muted small">
          El día 1 cambia las cargas cada semana del ciclo. Indica el lunes en que empezaste: ahora estás en la{' '}
          <strong>semana {week}</strong>.
        </p>
        <label className="label" htmlFor="cycle">Inicio del ciclo</label>
        <input
          id="cycle"
          type="date"
          value={state.settings.cycleStart}
          onChange={(e) => e.target.value && setSettings({ cycleStart: mondayOf(e.target.value) })}
        />
        <button className="btn" onClick={() => setSettings({ cycleStart: mondayOf(todayISO()) })}>
          Empezar ciclo esta semana
        </button>
      </div>

      {canInstall && (
        <>
          <h2 className="section-title">App</h2>
          <button className="card action" onClick={install}>
            <Smartphone size={20} /> Instalar en el móvil
          </button>
        </>
      )}

      <h2 className="section-title">Tus datos</h2>
      <div className="card">
        <p className="muted small">
          Todo se guarda solo en este móvil. Haz una copia de vez en cuando para no perder tu historial
          {persisted === false && ' (el navegador podría borrar los datos si se queda sin espacio)'}.
        </p>
        <div className="btn-row">
          <button className="btn" onClick={download}><Download size={18} /> Exportar copia</button>
          <button className="btn" onClick={() => fileRef.current.click()}><Upload size={18} /> Importar</button>
        </div>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onFile} />
        {msg && <p className="flash">{msg}</p>}
      </div>

      <button
        className="card action danger"
        onClick={() => confirm('¿Borrar TODOS los entrenamientos? No se puede deshacer.') && resetAll()}
      >
        <RotateCcw size={18} /> Borrar todos los datos
      </button>

      <p className="muted center small">Entreno v1.0 · {state.sessions.length} entrenamientos guardados</p>
    </div>
  );
}
