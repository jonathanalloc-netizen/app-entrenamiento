import { useRoute } from './router';
import { RestTimer, TabBar } from './components/ui';
import Home from './screens/Home';
import Session from './screens/Session';
import Progress from './screens/Progress';
import History from './screens/History';
import Settings from './screens/Settings';

export default function App() {
  const { name, param } = useRoute();

  if (name === 'sesion')
    return (
      <div className="app no-tabs">
        <Session id={param} />
        <RestTimer />
      </div>
    );

  return (
    <div className="app">
      {name === 'progreso' ? <Progress exId={param} /> : name === 'historial' ? <History /> : name === 'ajustes' ? <Settings /> : <Home />}
      <RestTimer />
      <TabBar active={name === 'progreso' || name === 'historial' || name === 'ajustes' ? name : 'hoy'} />
    </div>
  );
}
