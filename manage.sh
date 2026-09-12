#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

usage() {
  echo -e "${CYAN}LakshmiLikhon - Bill Generator Manager${NC}"
  echo ""
  echo "Usage: $0 <command>"
  echo ""
  echo "Commands:"
  echo -e "  ${GREEN}start${NC}      Start the application"
  echo -e "  ${GREEN}stop${NC}       Stop the application"
  echo -e "  ${GREEN}restart${NC}    Restart the application"
  echo -e "  ${GREEN}status${NC}     Show container status"
  echo -e "  ${GREEN}logs${NC}       Tail application logs"
  echo -e "  ${GREEN}build${NC}      Rebuild Docker images"
  echo -e "  ${GREEN}fresh${NC}      Remove everything and start fresh (WARNING: deletes data)"
  echo -e "  ${GREEN}test${NC}       Run unit tests"
  echo -e "  ${GREEN}help${NC}       Show this help message"
  echo ""
}

ensure_env() {
  if [ ! -f .env ]; then
    echo -e "${YELLOW}No .env file found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}.env created. Edit it with your settings before starting.${NC}"
  fi
}

cmd_start() {
  ensure_env
  echo -e "${BLUE}Starting LakshmiLikhon...${NC}"
  docker compose up -d
  echo -e "${GREEN}Application started at http://localhost:${APP_PORT:-3000}${NC}"
}

cmd_stop() {
  echo -e "${YELLOW}Stopping LakshmiLikhon...${NC}"
  docker compose down
  echo -e "${GREEN}Application stopped.${NC}"
}

cmd_restart() {
  echo -e "${YELLOW}Restarting LakshmiLikhon...${NC}"
  docker compose restart
  echo -e "${GREEN}Application restarted at http://localhost:${APP_PORT:-3000}${NC}"
}

cmd_status() {
  echo -e "${BLUE}Container Status:${NC}"
  docker compose ps
}

cmd_logs() {
  docker compose logs -f --tail=100
}

cmd_build() {
  echo -e "${BLUE}Rebuilding Docker images...${NC}"
  docker compose build --no-cache
  echo -e "${GREEN}Build complete.${NC}"
}

cmd_fresh() {
  echo -e "${RED}WARNING: This will delete ALL data including the database.${NC}"
  read -p "Are you sure? (y/N): " confirm
  if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
    echo -e "${YELLOW}Removing containers, volumes, and networks...${NC}"
    docker compose down -v
    echo -e "${YELLOW}Rebuilding...${NC}"
    docker compose build --no-cache
    echo -e "${YELLOW}Starting fresh...${NC}"
    docker compose up -d
    echo -e "${GREEN}Fresh start complete at http://localhost:${APP_PORT:-3000}${NC}"
  else
    echo -e "${CYAN}Cancelled.${NC}"
  fi
}

cmd_test() {
  echo -e "${BLUE}Running unit tests...${NC}"
  node --test tests/unit/helpers.test.js
}

case "${1:-help}" in
  start)   cmd_start ;;
  stop)    cmd_stop ;;
  restart) cmd_restart ;;
  status)  cmd_status ;;
  logs)    cmd_logs ;;
  build)   cmd_build ;;
  fresh)   cmd_fresh ;;
  test)    cmd_test ;;
  help|*)  usage ;;
esac
