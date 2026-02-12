LOCAL_COMPOSE=docker compose -f docker-compose.yml
PROD_COMPOSE=docker compose --env-file .env.prod -f docker-compose.prod.yml

.PHONY: local-up local-down local-logs local-ps local-rebuild prod-pull prod-up prod-down prod-logs

local-up:
	$(LOCAL_COMPOSE) up -d --build

local-down:
	$(LOCAL_COMPOSE) down

local-logs:
	$(LOCAL_COMPOSE) logs -f --tail=150

local-ps:
	$(LOCAL_COMPOSE) ps

local-rebuild:
	$(LOCAL_COMPOSE) build --no-cache
	$(LOCAL_COMPOSE) up -d

prod-pull:
	$(PROD_COMPOSE) pull

prod-up:
	$(PROD_COMPOSE) up -d --remove-orphans

prod-down:
	$(PROD_COMPOSE) down

prod-logs:
	$(PROD_COMPOSE) logs -f --tail=150
