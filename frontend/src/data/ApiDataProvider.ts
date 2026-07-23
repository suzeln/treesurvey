import type {
  DataProvider,
  SurveySession,
  TreeRecord,
} from "../types";

/**
 * Future provider for tree_survey_platform `/api/v1`.
 *
 * The component tree depends only on DataProvider, so switching from static
 * fixtures to the research API does not change page or viewer components.
 */
export class ApiDataProvider implements DataProvider {
  constructor(private readonly baseUrl = "/api/v1") {}

  private async request<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Tree platform API returned ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  listSessions(): Promise<SurveySession[]> {
    return this.request<SurveySession[]>("/sessions");
  }

  listTrees(sessionId?: string): Promise<TreeRecord[]> {
    const query = sessionId
      ? `?session_id=${encodeURIComponent(sessionId)}`
      : "";
    return this.request<TreeRecord[]>(`/trees${query}`);
  }

  getTree(id: string): Promise<TreeRecord | undefined> {
    return this.request<TreeRecord>(`/trees/${encodeURIComponent(id)}`);
  }
}
