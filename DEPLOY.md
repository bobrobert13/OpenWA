# Deployar OpenWA en Dokploy

## Opción A — Docker Compose (recomendado si tu Dokploy lo tiene)

1. **Create Service → Docker Compose**
2. Provider: GitHub, tu repo, branch `openWa-dokploy`
3. Llená:

| Campo | Valor |
|---|---|
| Build Path | `/` |
| Compose Path | `docker-compose.dokploy.yml` |

4. En **Environment** pegá las variables de `.env.dokploy`.
5. Deployá. Listo.

---

## Opción B — Application (Dockerfile único, el tipo que tenés ahora)

1. Editá tu aplicación actual en Dokploy
2. En **General**:

| Campo | Valor |
|---|---|
| Docker File | `Dockerfile.dokploy` |
| Docker Context Path | *(vacío)* |
| Docker Build Stage | *(vacío)* |
| Build Path | `/` |
| Branch | `openWa-dokploy` |

3. En **Environment** pegá las variables de `.env.dokploy` (incluí `DOMAIN`).
4. En **Advanced → Ports**, agregá: puerto `80`
5. En **Domains**, configurá tu dominio apuntando al puerto `80`:

| Campo | Valor |
|---|---|
| Host | `openwa.treborjs-dev.online` |
| Path | `/` |
| Container Port | `80` |

6. Deployá.

---

## Cómo funciona (ambas opciones)

Imagen única (`Dockerfile.dokploy`) que contiene:

- **API NestJS** corriendo en `localhost:2785` (interno)
- **Dashboard React** servido como estáticos
- **Nginx** en puerto 80 que:
  - Sirve el dashboard SPA en `/`
  - Proxyea `/api/*` y `/socket.io/*` al backend

Un solo contenedor, un solo puerto. Sin dependencias entre servicios.

---

## Environment mínimo

```env
DOMAIN=openwa.treborjs-dev.online
API_MASTER_KEY=TU_CLAVE_SEGURA_AQUI
NODE_ENV=production
DATABASE_TYPE=sqlite
ENGINE_TYPE=whatsapp-web.js
STORAGE_TYPE=local
```
