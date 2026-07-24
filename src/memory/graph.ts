/**
 * Knowledge Graph Memory Traversal Subsystem.
 * Represents relationships between Users, Projects, Agents, Tools, Files, Missions, and Knowledge.
 * @module @warborn/runtime/memory/graph
 */

import { GraphNode, GraphEdge, NodeId } from '@warborn/types';

export class KnowledgeGraphStore {
  private readonly nodes = new Map<NodeId, GraphNode>();
  private readonly edges: GraphEdge[] = [];

  public addNode(label: string, type: GraphNode['type'], properties: Record<string, unknown> = {}): GraphNode {
    const id = `node_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` as NodeId;
    const node: GraphNode = { id, label, type, properties };
    this.nodes.set(id, node);
    return node;
  }

  public addEdge(sourceId: NodeId, targetId: NodeId, relationship: string, weight = 1.0): GraphEdge {
    const edge: GraphEdge = { sourceId, targetId, relationship, weight };
    this.edges.push(edge);
    return edge;
  }

  public traverseNeighbors(nodeId: NodeId): readonly GraphNode[] {
    const connectedNodeIds = this.edges
      .filter(e => e.sourceId === nodeId || e.targetId === nodeId)
      .map(e => (e.sourceId === nodeId ? e.targetId : e.sourceId));

    return connectedNodeIds
      .map(id => this.nodes.get(id))
      .filter((n): n is GraphNode => n !== undefined);
  }

  public findNodesByType(type: GraphNode['type']): readonly GraphNode[] {
    return Array.from(this.nodes.values()).filter(n => n.type === type);
  }
}
