# Deployar OpenWA en Dokploy

## Requisitos

- Dokploy corriendo en tu VPS
- Dominio con registro A apuntando a la IP del VPS
- Repo conectado a Dokploy (GitHub)

---

## Paso 1 — Crear el servicio (tipo Docker Compose)

En Dokploy:

1. **Create Service → Compose → Docker Compose**
2. Provider: **GitHub**, seleccioná tu repo
3. Branch: `openWa-dokploy`

Completá solo estos campos:

| Campo | Valor |
|-------|-------|
| Compose Path | `docker-compose.dokploy.yml` |

El resto (Build Path, etc.) dejalo vacío o con default.

---

## Paso 2 — Variables de entorno

En la pestaña **Environment**, pegá:

```env
DOMAIN=openwa.treborjs-dev.online
API_MASTER_KEY=TU_CLAVE_SEGURA_AQUI
NODE_ENV=production
DATABASE_TYPE=sqlite
ENGINE_TYPE=whatsapp-web.js
STORAGE_TYPE=local
REDIS_ENABLED=false
QUEUE_ENABLED=false
WEBHOOK_TIMEOUT=10000
WEBHOOK_MAX_RETRIES=3
```

---

## Paso 3 — Deployar

Click en **Deploy**. Dokploy construye las dos imágenes (API + Dashboard), las levanta, y Traefik rutea el dominio al dashboard. El dashboard internamente proxyea `/api/*` y `/socket.io/*` al backend.

**Importante**: NO uses la pestaña Domains de Dokploy. El dominio ya está configurado vía label de Traefik en el compose con la variable `${DOMAIN}`.

---

## Cómo funciona

```
Internet → dokploy-network (Traefik) → dashboard:80
                                          ├── /           → SPA (React)
                                          ├── /api/*      → proxy → openwa-api:2785
                                          └── /socket.io/ → proxy → openwa-api:2785 (WebSocket)
```

- **openwa-api**: NestJS + Chromium (whatsapp-web.js), puerto 2785, sin exponer
- **dashboard**: Nginx + React SPA, puerto 80, único punto de entrada público
- **postgres / redis**: opcionales, activar con profiles

---

## HTTPS (opcional)

En el compose, cambiá:
```yaml
- "traefik.http.routers.openwa-dashboard.entrypoints=websecure"
- "traefik.http.routers.openwa-dashboard.tls=true"
- "traefik.http.routers.openwa-dashboard.tls.certresolver=letsencrypt"
```
Y en Dokploy → Settings → Certificates agregá Let's Encrypt para tu dominio.

---

## Solución de problemas

### Bad Gateway (502)
Ambos servicios (`openwa-api` y `dashboard`) deben aparecer en **running**. Si la API falla el healthcheck, el dashboard no arranca. Revisá los logs del deployment.

### 404
El build del dashboard falló. Revisá los logs del builder en el deployment para ver el error (posible error de TypeScript o Vite).

### Solo aparece un contenedor
Si solo ves `openwa-api` y no `dashboard`, el build del dashboard falló. Los logs del deployment muestran el motivo.
