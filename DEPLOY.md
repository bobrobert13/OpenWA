# Deployar OpenWA en Dokploy

## Requisitos previos

- Dokploy corriendo en tu VPS
- Dominio apuntando a tu VPS (registro A)
- Repo de GitHub conectado a Dokploy

---

## Paso 1 — Prepará las variables de entorno

Editá `.env.dokploy` con tus valores. **Lo único que tenés que cambiar:**

```env
DOMAIN=tu-dominio.com               # <-- tu dominio real
API_MASTER_KEY=una-clave-segura     # <-- clave fuerte para autenticar
```

---

## Paso 2 — Creá la aplicación en Dokploy

1. Dokploy → **Applications** → **Create Application**
2. Nombre: `openwa`
3. Provider: **Docker Compose**
4. Elegí tu repo, branch `main` (o `openWa-dokploy`)

5. Campos a llenar:

   | Campo | Valor |
   |-------|-------|
   | Build Path | `/` |
   | Compose Path | `docker-compose.dokploy.yml` |
   | (todo lo demás) | **vacío** |

6. En **Environment**, pegá el contenido de `.env.dokploy`.

7. Creá la aplicación.

---

## Paso 3 — Deployá

Eso es todo. Ni la pestaña **Domains** ni nada más. El compose ya tiene un label de Traefik que usa `${DOMAIN}` para rutear todo al dashboard. El dashboard internamente proxyea `/api/*` y `/socket.io/*` al backend.

Abrí `http://tu-dominio.com` y listo.

---

## Paso 4 (opcional) — HTTPS

1. Dokploy → **Settings → Certificates** → agregá Let's Encrypt para tu dominio.
2. Editá el compose y cambiá `entrypoints=web` por `entrypoints=websecure` en el label del dashboard.
3. Deployá.

---

## Paso 5 (opcional) — PostgreSQL o Redis

1. Editá la aplicación → **Docker Compose Profiles**: `postgres,redis`
2. Cambiá las variables:

   ```env
   DATABASE_TYPE=postgres
   DATABASE_HOST=postgres
   DATABASE_PASSWORD=openwa-seguro
   REDIS_ENABLED=true
   QUEUE_ENABLED=true
   ```

3. Re-deployá.

---

## Solución de problemas

### Bad Gateway
Ambos servicios deben estar corriendo. El dashboard depende de `openwa-api` — si la API falla el healthcheck, el dashboard no arranca hasta que la API esté healthy. Revisá los logs del servicio `openwa-api`.

### Las sesiones de WhatsApp se pierden al re-deployar
El volumen `openwa-data` debe estar mapeado a `/app/data`. Confirmalo en los detalles del servicio.
