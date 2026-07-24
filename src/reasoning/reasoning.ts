/**
 * Automatic Reasoning Mode Selector.
 * Dynamically selects ReasoningMode (DIRECT, STEP_BY_STEP, TREE_OF_THOUGHT, GRAPH_REASONING, REFLECTIVE, CONSENSUS).
 * @module @warborn/runtime/reasoning/reasoning
 */

import { ReasoningMode, IntentAnalysisResult } from '@warborn/types';

export class ReasoningEngine {
  public selectReasoningMode(intent: IntentAnalysisResult): ReasoningMode {
    if (intent.complexity >= 0.8) {
      return ReasoningMode.TREE_OF_THOUGHT;
    }
    if (intent.complexity >= 0.6) {
      return ReasoningMode.GRAPH_REASONING;
    }
    if (intent.urgency === 'high') {
      return ReasoningMode.STEP_BY_STEP;
    }
    return ReasoningMode.DIRECT;
  }
}
