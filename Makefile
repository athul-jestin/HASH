.PHONY: build_up down logs ps restart clean

build_up:
	docker compose up --build -d

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
