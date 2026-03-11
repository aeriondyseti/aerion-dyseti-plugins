#!/usr/bin/env bun
/**
 * SessionStart hook for vector-memory plugin.
 *
 * 1. Checks the vector-memory MCP server is reachable
 * 2. Triggers incremental conversation history indexing (if enabled)
 * 3. Loads the latest checkpoint with referenced memories
 * 4. Outputs structured JSON: systemMessage (user) + additionalContext (Claude)
 *
 * Steps 2 and 3 run in parallel to stay within the 15s hook timeout.
 * All operations are non-fatal — failures surface to the user but never block startup.
 */

import {
  ansi,
  icon,
  buildSystemMessage,
  emitHookOutput,
  debug,
  type MessageLine,
} from "./hook-output";

const VECTOR_MEMORY_URL =
  process.env.VECTOR_MEMORY_URL ?? "http://127.0.0.1:3271";

// ── Types ───────────────────────────────────────────────────────────

interface HealthResponse {
  status: string;
  config: {
    dbPath: string;
    embeddingModel: string;
    embeddingDimension: number;
    historyEnabled: boolean;
  };
}

interface IndexResponse {
  indexed: number;
  skipped: number;
  errors?: string[];
}

interface CheckpointResponse {
  content: string;
  metadata: Record<string, unknown>;
  referencedMemories: Array<{ id: string; content: string }>;
  updatedAt: string;
}

type FetchResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; status: number; error: string };

// ── Helpers ─────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

async function fetchJson<T>(
  path: string,
  options?: RequestInit & { timeout?: number }
): Promise<FetchResult<T>> {
  const { timeout = 5000, ...init } = options ?? {};
  try {
    const response = await fetch(`${VECTOR_MEMORY_URL}${path}`, {
      ...init,
      signal: AbortSignal.timeout(timeout),
    });
    if (!response.ok) {
      return { ok: false, status: response.status, error: `HTTP ${response.status}` };
    }
    return { ok: true, data: (await response.json()) as T, status: response.status };
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

function warningLines(warnings: string[]): MessageLine[] {
  return warnings.map((w) => ({
    icon: icon.warning,
    iconColor: ansi.yellow,
    text: w,
  }));
}

/** Emit user-facing message + optional Claude context, then exit. */
function emit(
  userLines: MessageLine[],
  warnings: string[],
  additionalContext?: string
): void {
  const allLines = [...userLines, ...warningLines(warnings)];
  if (allLines.length === 0) return;

  emitHookOutput({
    systemMessage: buildSystemMessage("Vector Memory", allLines),
    ...(additionalContext && {
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext,
      },
    }),
  });
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  // Read hook input from stdin (required by hook protocol)
  await Bun.stdin.text();

  const userLines: MessageLine[] = [];
  const warnings: string[] = [];

  // Step 1: Health check (must complete before parallel work)
  const health = await fetchJson<HealthResponse>("/health");
  if (!health.ok) {
    debug("session-start", `Server unreachable: ${health.error}`);
    return;
  }

  debug("session-start", "Server healthy");

  // Steps 2 & 3: Index conversations + load checkpoint in parallel
  const indexPromise = health.data.config.historyEnabled
    ? fetchJson<IndexResponse>("/index-conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
        timeout: 10000,
      })
    : null;

  const checkpointPromise = fetchJson<CheckpointResponse>("/checkpoint");

  const [indexResult, checkpoint] = await Promise.all([
    indexPromise,
    checkpointPromise,
  ]);

  // Process indexing result
  if (indexResult) {
    if (!indexResult.ok) {
      warnings.push("Conversation indexing failed");
      debug("session-start", `Indexing failed: ${indexResult.error}`);
    } else if (indexResult.data.indexed > 0 || (indexResult.data.errors?.length ?? 0) > 0) {
      const d = indexResult.data;
      const errorSuffix = d.errors?.length ? `, ${d.errors.length} errors` : "";
      userLines.push({
        icon: icon.database,
        iconColor: ansi.cyan,
        text: `Indexed ${d.indexed} sessions, skipped ${d.skipped}${errorSuffix}`,
      });
      debug("session-start", `Indexed ${d.indexed}, skipped ${d.skipped}${errorSuffix}`);
    }
  }

  // Process checkpoint result
  if (!checkpoint.ok) {
    if (checkpoint.status === 404) {
      userLines.push({
        icon: icon.dot,
        text: `${ansi.dim}No checkpoint found — fresh session${ansi.reset}`,
      });
    } else {
      warnings.push(`Checkpoint load failed: ${checkpoint.error}`);
      debug("session-start", `Checkpoint error: ${checkpoint.error}`);
    }
    emit(userLines, warnings);
    return;
  }

  // Step 4: Format output
  const cp = checkpoint.data;
  const age = timeAgo(cp.updatedAt);
  const branch = cp.metadata.branch as string | undefined;
  const memoryCount = cp.referencedMemories.length;

  // User-facing summary
  userLines.push({
    icon: icon.check,
    iconColor: ansi.green,
    text: `Checkpoint loaded ${ansi.dim}(${age})${ansi.reset}`,
  });

  const detailParts: string[] = [];
  if (memoryCount > 0) {
    detailParts.push(`${memoryCount} ${memoryCount === 1 ? "memory" : "memories"}`);
  }
  if (branch) {
    detailParts.push(`${ansi.blue}${icon.branch} ${branch}${ansi.reset}`);
  }
  if (detailParts.length > 0) {
    userLines.push({
      icon: icon.book,
      iconColor: ansi.magenta,
      text: detailParts.join(` ${ansi.dim}${icon.dot}${ansi.reset} `),
    });
  }

  // Claude-facing context
  const contextParts: string[] = [];

  const metaParts = [`Updated: ${cp.updatedAt}`];
  if (branch) metaParts.push(`Branch: ${branch}`);
  if (cp.metadata.project) metaParts.push(`Project: ${cp.metadata.project}`);

  contextParts.push(`## Session Checkpoint (${metaParts.join(" | ")})\n\n${cp.content}`);

  if (memoryCount > 0) {
    const memories = cp.referencedMemories
      .map((m) => `### Memory: ${m.id}\n${m.content}`)
      .join("\n\n");
    contextParts.push(`## Referenced Memories (${memoryCount})\n\n${memories}`);
  }

  emit(userLines, warnings, contextParts.join("\n\n"));
}

main().catch((err) => {
  debug("session-start", `Fatal: ${err?.message ?? err}`);
  emitHookOutput({
    systemMessage: buildSystemMessage("Vector Memory", [
      {
        icon: icon.warning,
        iconColor: ansi.yellow,
        text: `Hook error: ${err?.message ?? "unknown"}`,
      },
    ]),
  });
});
