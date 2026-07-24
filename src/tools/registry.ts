/**
 * Dynamic Tool Registry with Hot Registration Support.
 * @module @warborn/runtime/tools/registry
 */

import { ITool, ToolCategory } from '@warborn/types';

export class ToolRegistry {
  private readonly tools = new Map<string, ITool>();

  public registerTool(tool: ITool): void {
    this.tools.set(tool.id.toLowerCase(), tool);
    this.tools.set(tool.name.toLowerCase(), tool);
    console.log(`🛠️ [ToolRegistry] Registered Tool: ${tool.name} (${tool.category} v${tool.version})`);
  }

  public unregisterTool(toolIdOrName: string): boolean {
    const key = toolIdOrName.toLowerCase();
    const tool = this.tools.get(key);
    if (tool) {
      this.tools.delete(tool.id.toLowerCase());
      this.tools.delete(tool.name.toLowerCase());
      console.log(`🛠️ [ToolRegistry] Unregistered Tool: ${tool.name}`);
      return true;
    }
    return false;
  }

  public getTool(toolIdOrName: string): ITool | undefined {
    return this.tools.get(toolIdOrName.toLowerCase());
  }

  public listTools(category?: ToolCategory): readonly ITool[] {
    const uniqueTools = Array.from(new Set(this.tools.values()));
    if (category) {
      return uniqueTools.filter(t => t.category === category);
    }
    return uniqueTools;
  }
}
