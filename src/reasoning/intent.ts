/**
 * Intent Analysis Subsystem for Cortex Reasoning Engine.
 * Parses user objectives, hidden intent, complexity, urgency, and required capabilities.
 * @module @warborn/runtime/reasoning/intent
 */

import { IntentAnalysisResult } from '@warborn/types';

export class IntentEngine {
  public analyzeIntent(userGoal: string): IntentAnalysisResult {
    const goalLower = userGoal.toLowerCase();

    // 1. Urgency Detection
    let urgency: 'low' | 'medium' | 'high' = 'medium';
    if (goalLower.includes('urgent') || goalLower.includes('immediately') || goalLower.includes('fix') || goalLower.includes('error')) {
      urgency = 'high';
    } else if (goalLower.includes('eventually') || goalLower.includes('document') || goalLower.includes('explore')) {
      urgency = 'low';
    }

    // 2. Complexity Calculation
    let complexity = 0.4;
    if (goalLower.includes('deploy') || goalLower.includes('architect') || goalLower.includes('build') || goalLower.includes('refactor')) {
      complexity = 0.85;
    } else if (goalLower.length > 100) {
      complexity = 0.70;
    }

    // 3. Required Capabilities Extraction
    const requiredCapabilities: string[] = ['memory.read'];
    if (goalLower.includes('code') || goalLower.includes('build') || goalLower.includes('fix')) {
      requiredCapabilities.push('coder', 'file.write');
    }
    if (goalLower.includes('deploy') || goalLower.includes('cloud')) {
      requiredCapabilities.push('devops', 'network.access');
    }
    if (goalLower.includes('audit') || goalLower.includes('security')) {
      requiredCapabilities.push('security.auditor');
    }

    // 4. Hidden Objective Synthesis
    let hiddenObjective: string | undefined;
    if (goalLower.includes('build') || goalLower.includes('implement')) {
      hiddenObjective = 'Ensure 100% test coverage and zero regression in existing architecture.';
    }

    return {
      objective: userGoal,
      hiddenObjective,
      urgency,
      complexity,
      requiredCapabilities,
      confidence: 0.95,
    };
  }
}
