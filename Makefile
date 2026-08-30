.PHONY: build_up down logs ps restart clean reset-data

build_up:
	docker compose up --build

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps

restart:
	docker compose down && docker compose up -d

clean:
	docker compose down --rmi all --volumes --remove-orphans

reset-data:
	docker compose run --rm --build backend python -m backend.scripts.reset_data
