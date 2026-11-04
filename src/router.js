import { useEffect, useState } from 'react';

// Rutas por hash (#/progreso, #/sesion/abc…) para que funcionen en GitHub Pages
// y el botón "atrás" de Android navegue dentro de la app.
function parse(hash) {
  const [name = '', param] = hash.replace(/^#\/?/, '').split('/');
  return { name: name || 'hoy', param: param ? decodeURIComponent(param) : null };
}

export function useRoute() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const onChange = () => {
      setHash(location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return parse(hash);
}

export const navigate = (path) => {
  location.hash = path;
};

export const goBack = (fallback = '/') => {
  if (history.length > 1) history.back();
  else navigate(fallback);
};
