# Entreno

App móvil (PWA) para seguir la rutina de entrenamiento, apuntar los pesos de cada serie y ver la progresión semanal de cada ejercicio.

- **Hoy**: semana del ciclo, entrenos de la semana, volumen y acceso al día que toca.
- **Entreno**: series con peso y reps, los valores de la última vez como referencia y temporizador de descanso.
- **Progreso**: gráfica semanal por ejercicio (peso máximo, 1RM estimado, volumen, reps).
- **Historial** y **Ajustes** (inicio del ciclo, exportar/importar copia).

Los datos se guardan solo en el móvil (localStorage).

## Desarrollo

```bash
npm install
npm run dev
```

La rutina está en [`src/routine.js`](src/routine.js). Cada push a `main` publica la app en GitHub Pages (`.github/workflows/deploy.yml`).
