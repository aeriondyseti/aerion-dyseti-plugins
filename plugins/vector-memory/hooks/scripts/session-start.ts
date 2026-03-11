#!/usr/bin/env bun
/**
 * SessionStart hook for vector-memory plugin.
 *
 * 1. Triggers incremental conversation history indexing (if enabled)
 * 2. Loads and outputs the latest checkpoint with referenced memories
 *
 * Uses the HTTP API so it works as a standalone plugin hook.
 * All operations are non-fatal — a server that isn't running or
 * doesn't have history enabled simply gets skipped.
 */

const VECTOR_MEMORY_URL =
  process.env.VECTOR_MEMORY_URL ?? "http://127.0.0.1:3271";

interface HealthResponse {
  status: string;
  config: {
    historyEnabled?: boolean;
  };
}

interface CheckpointResponse {
  content: string;
  metadata: Record<string, unknown>;
  referencedMemories: Array<{ id: string; content: string }>;
  updatedAt: string;
}

async function main() {
  // Read hook input from stdin (required by hook protocol)
  await Bun.stdin.text();

  // Step 1: Check server health and trigger indexing if history is enabled
  try {
    const healthResponse = await fetch(`${VECTOR_MEMORY_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });

    if (healthResponse.ok) {
      const health: HealthResponse = await healthResponse.json();

      if (health.config.historyEnabled) {
        try {
          const indexResponse = await fetch(
            `${VECTOR_MEMORY_URL}/index-conversations`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: "{}",
              signal: AbortSignal.timeout(10000),
            }
          );
          if (indexResponse.ok) {
            const result = await indexResponse.json();
            if (result.indexed > 0 || result.errors?.length > 0) {
              console.error(
                `[vector-memory] Indexed ${result.indexed} sessions, skipped ${result.skipped}` +
                  (result.errors?.length > 0
                    ? `, ${result.errors.length} errors`
                    : "")
              );
            }
          }
        } catch {
          // Non-fatal — indexing failure shouldn't block session start
        }
      }
    }
  } catch {
    // Server not running or unreachable — continue to checkpoint attempt
  }

  // Step 2: Fetch latest checkpoint
  let checkpoint: CheckpointResponse;
  try {
    const response = await fetch(`${VECTOR_MEMORY_URL}/checkpoint`, {
      signal: AbortSignal.timeout(5000),
    });

    if (response.status === 404) {
      // No checkpoint found — start fresh
      return;
    }

    if (!response.ok) {
      return;
    }

    checkpoint = await response.json();
  } catch {
    // Server not running or unreachable — no action needed
    return;
  }

  // Build output: checkpoint content + referenced memories
  let output = checkpoint.content;

  if (checkpoint.referencedMemories.length > 0) {
    const memories = checkpoint.referencedMemories
      .map((m) => `### Memory: ${m.id}\n${m.content}`)
      .join("\n\n");
    output += `\n\n## Referenced Memories\n\n${memories}`;
  }

  console.log(output);
}

main().catch(() => process.exit(0));
