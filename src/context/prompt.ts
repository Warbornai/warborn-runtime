/**
 * Structured Prompt Builder Engine for Cortex.
 * @module @warborn/runtime/context/prompt
 */

import { ContextRankedItem } from '@warborn/types';

export interface PromptSections {
  readonly systemIdentity: string;
  readonly missionObjectives?: string;
  readonly contextPayload: string;
  readonly userRequest: string;
  readonly constraints: readonly string[];
}

export class PromptBuilder {
  public static buildStructuredPrompt(query: string, compressedContext: string, rankedItems: readonly ContextRankedItem[]): string {
    const systemHeader = `# WARBORN CORTEX OPERATING SYSTEM ENVIROMENT
You are Warborn Cortex, an Autonomous AI Operating System.
You operate with full architectural awareness across local workspace, agent tools, and multi-tenant cloud pipelines.`;

    const missionItems = rankedItems.filter(i => i.sourceName.includes('Mission') || i.sourceName.includes('Memory'));
    const workspaceItems = rankedItems.filter(i => i.sourceName.includes('Workspace') || i.sourceName.includes('File'));
    const toolItems = rankedItems.filter(i => i.sourceName.includes('Tool'));

    const sections: string[] = [
      systemHeader,
      `\n## 🎯 MISSION & OPERATIONAL GOALS`,
      missionItems.map(m => m.context).join('\n') || 'Execute requested user command with high technical accuracy.',

      `\n## 📂 WORKSPACE & ENVIRONMENT CONTEXT`,
      workspaceItems.map(w => w.context).join('\n') || 'Active repository workspace root.',

      `\n## 🛠️ AVAILABLE AGENT CAPABILITIES & TOOLS`,
      toolItems.map(t => t.context).join('\n') || 'Standard system execution tools available.',

      `\n## 🧠 ASSEMBLED CONTEXT & KNOWLEDGE`,
      compressedContext,

      `\n## 💬 USER REQUEST`,
      query,

      `\n## ⚡ EXECUTION CONSTRAINTS`,
      `- Do not fabricate unverified system state.`,
      `- Maintain strict 4-Tier Warborn OS encapsulation.`,
      `- Provide clear, structured, production-ready responses.`,
    ];

    return sections.join('\n');
  }
}
