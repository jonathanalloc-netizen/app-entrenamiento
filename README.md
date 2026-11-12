# Entreno

App móvil (PWA) para seguir la rutina de entrenamiento, apuntar los pesos de cada serie y ver la progresión semanal de cada ejercicio.

- **Hoy**: semana del ciclo, entrenos de la semana, volumen y acceso al día que toca.
- **Entreno**: series con peso y reps, los valores de la última vez como referencia y temporizador de descanso.
- **Dieta**: plan de comidas según sea día de pesas o de descanso, con comidas y creatina para marcar.
- **Progreso**: gráfica semanal por ejercicio (peso máximo, 1RM estimado, volumen, reps).
- **Historial** y **Ajustes** (inicio del ciclo, exportar/importar copia).

Los datos se guardan solo en el móvil (localStorage).

## Desarrollo

```bash
npm install
npm run dev
```

## Perfiles

Cada persona tiene su carpeta en `src/profiles/<perfil>/` con `routine.js`, `nutrition.js` y `profile.json`, y se publica como una app independiente:

- `jonathan` → `/app-entrenamiento/`
- `lucia` → `/app-entrenamiento/lucia/`

Para probar otro perfil en local: `PROFILE=lucia npx vite`. Cada push a `main` publica todos los perfiles en GitHub Pages (`.github/workflows/deploy.yml`).
