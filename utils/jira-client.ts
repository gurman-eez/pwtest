export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
}

export type JiraIssueType = 'Bug' | 'Task';

export interface CreateIssueParams {
  projectKey: string;
  type: JiraIssueType;
  summary: string;
  description: string;
  /** TestRail case ID (numeric or "C1234") this issue is linked to; added as a label, e.g. "testrail-C1234". */
  testRailCaseId?: string | number;
  labels?: string[];
}

export interface JiraIssue {
  id: string;
  key: string;
  self: string;
}

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  [key: string]: unknown;
}

/**
 * Thin wrapper around the Jira Cloud REST API v3 (https://<host>.atlassian.net/rest/api/3/...).
 * Auth is Basic (account email + API token), Jira Cloud's standard scheme for scripted access.
 *
 * Every method logs and swallows request failures (network errors, non-2xx responses, bad JSON)
 * instead of throwing, returning null on failure so a single broken Jira call can't crash a test
 * run or reporting script.
 */
export class JiraClient {
  private baseUrl: string;
  private authHeader: string;

  constructor(config: Partial<JiraConfig> = {}) {
    const baseUrl = config.baseUrl ?? process.env.JIRA_URL;
    const email = config.email ?? process.env.JIRA_EMAIL;
    const apiToken = config.apiToken ?? process.env.JIRA_API_TOKEN;

    if (!baseUrl || !email || !apiToken) {
      throw new Error(
        'JiraClient requires JIRA_URL, JIRA_EMAIL, and JIRA_API_TOKEN (env or constructor config).'
      );
    }

    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.authHeader = 'Basic ' + Buffer.from(`${email}:${apiToken}`).toString('base64');
  }

  /** POST /rest/api/3/issue — creates a Bug/Task, tagging it with a TestRail case label if given. */
  async createIssue(params: CreateIssueParams): Promise<JiraIssue | null> {
    const labels = [...(params.labels ?? [])];
    if (params.testRailCaseId !== undefined) {
      labels.push(`testrail-${params.testRailCaseId}`);
    }

    const body = {
      fields: {
        project: { key: params.projectKey },
        summary: params.summary,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: params.description }],
            },
          ],
        },
        issuetype: { name: params.type },
        labels,
      },
    };

    return this.request('POST', '/rest/api/3/issue', body);
  }

  /** GET /rest/api/3/myself — returns the authenticated user; used to sanity-check credentials. */
  async getCurrentUser(): Promise<JiraUser | null> {
    return this.request('GET', '/rest/api/3/myself');
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          Authorization: this.authHeader,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : undefined;

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} — ${text}`);
      }

      return data as T;
    } catch (error) {
      console.error(
        `[JiraClient] ${method} ${path} failed:`,
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }
}
