# ⚡ @warborn/runtime

> **The Headless Brain & Operating System Kernel for Warborn OS.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🧠 Overview

`@warborn/runtime` is the headless core engine of the Warborn AI Operating System. It extracts all reasoning, planning, task decomposition, agent management, context routing, and event orchestration out of client applications.

---

## 📦 Subsystems

* **`@warborn/runtime/brain`**: Goal decomposition, reasoning orchestration, model selection.
* **`@warborn/runtime/agents`**: Agent registry, mission assignment, runtime lifecycle.
* **`@warborn/runtime/context`**: Context assembly, memory manager, knowledge vectors.
* **`@warborn/runtime/events`**: Decoupled pub/sub event bus and store.
* **`@warborn/runtime/security`**: Policy engine and identity management.

---

## 💡 Usage Example

```typescript
import { getRuntimeEngine } from '@warborn/runtime';

const runtime = getRuntimeEngine();

// Initialize the brain
await runtime.start();

// Decompose a high-level goal into actionable steps
const plan = await runtime.brain.decomposeGoal("Deploy multi-agent research workflow");
console.log("Plan Steps:", plan.steps);
```

---

## 📄 License

MIT © 2026 Warborn Technologies
