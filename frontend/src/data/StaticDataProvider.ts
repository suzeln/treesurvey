import { sessions, trees } from "./staticData";
import type { DataProvider, TreeRecord } from "../types";

const delay = async () => Promise.resolve();

export class StaticDataProvider implements DataProvider {
  async listSessions() {
    await delay();
    return sessions;
  }

  async listTrees(sessionId?: string) {
    await delay();
    return sessionId
      ? trees.filter((tree) => tree.sessionId === sessionId)
      : trees;
  }

  async getTree(id: string): Promise<TreeRecord | undefined> {
    await delay();
    return trees.find((tree) => tree.id === id);
  }
}

export const staticDataProvider = new StaticDataProvider();
