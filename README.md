# HASH
A cloud-based medical video assistant with an AI chatbot.

## Docker Setup

This repository now includes a Dockerized frontend and Python FastAPI backend.

- `make build_up` builds both containers and starts the app
- `make down` stops the containers
- `make logs` tails service logs
- `make restart` restarts services
- `make clean` removes containers, networks, images, and volumes

### Notes

- Add a root environment file by copying `./.env.example` to `./.env`
- Configure `MONGO_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, and Firebase values before running
- If your Mongo password contains special characters like `@`, `#`, or `/`, either:
  - URL-encode the password inside `MONGO_URI`, or
  - use the separate variables `MONGO_USER`, `MONGO_PASSWORD`, `MONGO_HOST`, `MONGO_DB`, and optional `MONGO_OPTIONS`
- The backend is exposed at `http://localhost:5000`
- The frontend is served from `http://localhost:3000`
