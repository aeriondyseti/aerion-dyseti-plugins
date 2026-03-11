#!/usr/bin/env bash
# plugin-swap.sh — Toggle a plugin between its stable (cached) version and
# the live development source via symlink.
#
# Usage:
#   plugin-swap.sh <plugin-name> dev     # Use live source code
#   plugin-swap.sh <plugin-name> stable  # Use downloaded/cached version
#   plugin-swap.sh <plugin-name> status  # Show which mode is active
#
# Examples:
#   plugin-swap.sh vector-memory dev
#   plugin-swap.sh dev-flow stable
#   plugin-swap.sh vector-memory status

set -euo pipefail

# ── Configuration ──────────────────────────────────────────────────
MARKETPLACE="claude-plugins"
CACHE_BASE="$HOME/.claude/plugins/cache/$MARKETPLACE"
SOURCE_BASE="$HOME/Development/tools/claude-plugins/packages"

# ── Colors ─────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
DIM='\033[2m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Helpers ────────────────────────────────────────────────────────

die() { echo -e "${RED}error:${RESET} $1" >&2; exit 1; }

usage() {
  echo -e "${BOLD}Usage:${RESET} $(basename "$0") <plugin-name> <dev|stable|status>"
  echo
  echo "Plugins available:"
  for dir in "$SOURCE_BASE"/*/; do
    name=$(basename "$dir")
    echo "  - $name"
  done
  exit 1
}

# Find the installed version directory for a plugin.
# Returns the path to the versioned cache dir (e.g., .../vector-memory/1.4.0)
find_cache_dir() {
  local plugin="$1"
  local plugin_dir="$CACHE_BASE/$plugin"

  [[ -d "$plugin_dir" ]] || die "No cached install found for '$plugin' at $plugin_dir"

  # Find the active version — either a real dir or a symlink
  local version_dir
  version_dir=$(find "$plugin_dir" -maxdepth 1 -mindepth 1 \
    \( -type d -o -type l \) \
    ! -name "*.stable" \
    | head -1)

  [[ -n "$version_dir" ]] || die "No version directory found in $plugin_dir"
  echo "$version_dir"
}

find_stable_backup() {
  local plugin="$1"
  local plugin_dir="$CACHE_BASE/$plugin"
  local backup
  backup=$(find "$plugin_dir" -maxdepth 1 -mindepth 1 -type d -name "*.stable" | head -1)
  echo "$backup"
}

# ── Commands ───────────────────────────────────────────────────────

cmd_status() {
  local plugin="$1"
  local cache_dir
  cache_dir=$(find_cache_dir "$plugin")
  local version=$(basename "$cache_dir")

  if [[ -L "$cache_dir" ]]; then
    local target
    target=$(readlink -f "$cache_dir")
    echo -e "${CYAN}${BOLD}$plugin${RESET} ${DIM}($version)${RESET}"
    echo -e "  Mode:   ${GREEN}dev${RESET}"
    echo -e "  Link:   $cache_dir -> $target"
    local backup
    backup=$(find_stable_backup "$plugin")
    if [[ -n "$backup" ]]; then
      echo -e "  Stable: $(basename "$backup") ${DIM}(backed up)${RESET}"
    fi
  else
    echo -e "${CYAN}${BOLD}$plugin${RESET} ${DIM}($version)${RESET}"
    echo -e "  Mode:   ${YELLOW}stable${RESET}"
    echo -e "  Path:   $cache_dir"
  fi
}

cmd_dev() {
  local plugin="$1"
  local source_dir="$SOURCE_BASE/$plugin"
  local cache_dir
  cache_dir=$(find_cache_dir "$plugin")
  local version=$(basename "$cache_dir")

  [[ -d "$source_dir" ]] || die "Source directory not found: $source_dir"

  # Already in dev mode?
  if [[ -L "$cache_dir" ]]; then
    echo -e "${DIM}$plugin is already in dev mode${RESET}"
    cmd_status "$plugin"
    return 0
  fi

  # Back up the stable version
  local stable_backup="${cache_dir}.stable"
  if [[ -d "$stable_backup" ]]; then
    die "Stable backup already exists at $stable_backup but cache is not a symlink. Manual cleanup needed."
  fi

  echo -e "Switching ${BOLD}$plugin${RESET} to ${GREEN}dev${RESET} mode..."
  mv "$cache_dir" "$stable_backup"
  ln -s "$source_dir" "$cache_dir"

  echo -e "  ${DIM}Backed up:${RESET} $version -> ${version}.stable"
  echo -e "  ${DIM}Symlinked:${RESET} $cache_dir -> $source_dir"
  echo
  cmd_status "$plugin"
}

cmd_stable() {
  local plugin="$1"
  local cache_dir
  cache_dir=$(find_cache_dir "$plugin")
  local version=$(basename "$cache_dir")

  # Already in stable mode?
  if [[ ! -L "$cache_dir" ]]; then
    echo -e "${DIM}$plugin is already in stable mode${RESET}"
    cmd_status "$plugin"
    return 0
  fi

  local stable_backup
  stable_backup=$(find_stable_backup "$plugin")
  [[ -n "$stable_backup" ]] || die "No stable backup found. Cannot restore."

  echo -e "Switching ${BOLD}$plugin${RESET} to ${YELLOW}stable${RESET} mode..."
  rm "$cache_dir"
  mv "$stable_backup" "$cache_dir"

  echo -e "  ${DIM}Restored:${RESET} $cache_dir from $(basename "$stable_backup")"
  echo
  cmd_status "$plugin"
}

# ── Main ───────────────────────────────────────────────────────────

[[ $# -ge 2 ]] || usage

plugin="$1"
command="$2"

case "$command" in
  dev)    cmd_dev "$plugin" ;;
  stable) cmd_stable "$plugin" ;;
  status) cmd_status "$plugin" ;;
  *)      usage ;;
esac
