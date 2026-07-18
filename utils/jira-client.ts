export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
}

/**
 * Exact issue type name as configured in the target project — not a fixed enum, since Jira
 * projects can rename/localize their own types (this one's "Bug" type is literally named
 * "Баг"). Verify via GET /rest/api/3/issue/createmeta?projectKeys=<key>&expand=projects.issuetypes
 * rather than assuming "Bug" works everywhere.
 */
export type JiraIssueType = string;

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

export interface JiraSearchIssue {
  key: string;
  fields: {
    summary: string;
    status?: { name: string; statusCategory?: { key: string } };
    labels?: string[];
  };
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
        // ADF text nodes don't interpret "\n" as line breaks, so each line of the input
        // string becomes its own paragraph (blank lines -> empty paragraphs) instead of one
        // run-on blob.
        description: {
          type: 'doc',
          version: 1,
          content: params.description.split('\n').map((line) => ({
            type: 'paragraph',
            content: line ? [{ type: 'text', text: line }] : [],
          })),
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

  /**
   * GET /rest/api/3/search/jql — runs a JQL query (the pre-2025 /rest/api/3/search endpoint
   * is retired, returns 410 Gone). Used to check for an existing open issue before filing a
   * new one for the same failure.
   */
  async searchIssues(jql: string, maxResults = 50): Promise<JiraSearchIssue[] | null> {
    const params = new URLSearchParams({ jql, maxResults: String(maxResults), fields: 'summary,status,labels' });
    const data = await this.request<{ issues: JiraSearchIssue[] }>('GET', `/rest/api/3/search/jql?${params}`);
    return data ? data.issues : null;
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
