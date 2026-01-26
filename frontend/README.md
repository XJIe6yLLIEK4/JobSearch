# JobSearch Frontend (React + Vite)

## Зачем здесь `/api`
Чтобы не мучаться с CORS:
- в **dev** Vite проксирует запросы `/api/*` на `http://localhost:8080/*`
- в **prod** nginx внутри контейнера проксирует `/api/*` на сервис `app:8080` из docker-compose.

## Локальный запуск (dev)
1) Подними backend (например, `./gradlew bootRun` или `docker compose up -d app db`).
2) Фронт:
```bash
cd frontend
npm install
npm run dev
```
Открой `http://localhost:5173`.

## Docker (prod-подобный)
```bash
docker compose up --build
```
Открой `http://localhost`.
