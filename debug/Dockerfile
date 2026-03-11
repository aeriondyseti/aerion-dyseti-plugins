FROM ubuntu:24.04

RUN apt-get update && apt-get install -y curl git unzip && rm -rf /var/lib/apt/lists/*

# Install Node.js 22 (LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

# Install Claude Code
RUN npm install -g @anthropic-ai/claude-code

# Install Bun (needed to run .ts hook scripts)
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Create a minimal test git repo
WORKDIR /test-repo
RUN git init && git config user.email "test@test" && git config user.name "Test" && \
    git commit --allow-empty -m "init"
