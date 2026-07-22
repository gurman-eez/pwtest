export interface TestRailConfig {
  baseUrl: string;
  email: string;
  apiKey: string;
}

export interface TestRailProject {
  id: number;
  name: string;
  [key: string]: unknown;
}

export interface TestRailSuite {
  id: number;
  name: string;
  project_id: number;
  [key: string]: unknown;
}

export interface TestRailSection {
  id: number;
  name: string;
  suite_id: number;
  parent_id: number | null;
  [key: string]: unknown;
}

export interface TestRailCase {
  id: number;
  title: string;
  section_id: number;
  refs?: string | null;
  [key: string]: unknown;
}

export interface TestRailCaseField {
  id: number;
  system_name: string;
  label: string;
  type_id: number;
  configs: unknown[];
  [key: string]: unknown;
}

export interface TestRailCaseType {
  id: number;
  name: string;
  is_default: boolean;
  [key: string]: unknown;
}

export interface TestRailPriority {
  id: number;
  name: string;
  short_name: string;
  is_default: boolean;
  [key: string]: unknown;
}

export interface TestRailTemplate {
  id: number;
  name: string;
  is_default: boolean;
  [key: string]: unknown;
}

export interface TestRailRun {
  id: number;
  name: string;
  suite_id: number;
  project_id: number;
  [key: string]: unknown;
}

export type TestRailResultStatus = 'passed' | 'failed';

export interface TestRailResultInput {
  caseId: number;
  status: TestRailResultStatus;
  comment?: string;
}

/** TestRail status_id values for the statuses this client publishes. */
const STATUS_IDS: Record<TestRailResultStatus, number> = {
  passed: 1,
  failed: 5,
};

/**
 * Thin wrapper around the TestRail v2 REST API (https://<host>/index.php?/api/v2/...).
 * Auth is Basic (email + API key), same as TestRail's official API docs recommend for
 * apps that authenticate as a specific user rather than via session cookies.
 *
 * Every method logs and swallows request failures (network errors, non-2xx responses,
 * bad JSON) instead of throwing, returning null on failure so a single broken TestRail
 * call can't crash a test run or reporting script.
 */
export class TestRailClient {
  private baseUrl: string;
  private authHeader: string;

  constructor(config: Partial<TestRailConfig> = {}) {
    const baseUrl = config.baseUrl ?? process.env.TESTRAIL_URL;
    const email = config.email ?? process.env.TESTRAIL_EMAIL;
    const apiKey = config.apiKey ?? process.env.TESTRAIL_API_KEY;

    if (!baseUrl || !email || !apiKey) {
      throw new Error(
        'TestRailClient requires TESTRAIL_URL, TESTRAIL_EMAIL, and TESTRAIL_API_KEY (env or constructor config).'
      );
    }

    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.authHeader = 'Basic ' + Buffer.from(`${email}:${apiKey}`).toString('base64');
  }

  /** GET /get_projects — lists projects visible to the authenticated user. */
  async getProjects(): Promise<TestRailProject[] | null> {
    const data = await this.request<{ projects: TestRailProject[] } | TestRailProject[]>(
      'GET',
      '/index.php?/api/v2/get_projects'
    );
    if (!data) return null;
    return Array.isArray(data) ? data : data.projects;
  }

  /** GET /get_suites/{project_id} — lists test suites belonging to a project. */
  async getSuites(projectId: number): Promise<TestRailSuite[] | null> {
    const data = await this.request<{ suites: TestRailSuite[] } | TestRailSuite[]>(
      'GET',
      `/index.php?/api/v2/get_suites/${projectId}`
    );
    if (!data) return null;
    return Array.isArray(data) ? data : data.suites;
  }

  /** GET /get_sections/{project_id}&suite_id={suite_id} — lists sections in a suite. */
  async getSections(projectId: number, suiteId?: number): Promise<TestRailSection[] | null> {
    const query = suiteId !== undefined ? `${projectId}&suite_id=${suiteId}` : `${projectId}`;
    const data = await this.request<{ sections: TestRailSection[] } | TestRailSection[]>(
      'GET',
      `/index.php?/api/v2/get_sections/${query}`
    );
    if (!data) return null;
    return Array.isArray(data) ? data : data.sections;
  }

  /** GET /get_case/{case_id} — fetches a single case, used to read its `refs` field for Jira labels. */
  async getCase(caseId: number): Promise<TestRailCase | null> {
    return this.request('GET', `/index.php?/api/v2/get_case/${caseId}`);
  }

  /** GET /get_cases/{project_id}&suite_id={suite_id} — lists cases in a suite. */
  async getCases(projectId: number, suiteId: number): Promise<TestRailCase[] | null> {
    const data = await this.request<{ cases: TestRailCase[] } | TestRailCase[]>(
      'GET',
      `/index.php?/api/v2/get_cases/${projectId}&suite_id=${suiteId}`
    );
    if (!data) return null;
    return Array.isArray(data) ? data : data.cases;
  }

  /** POST /add_section/{project_id} — creates a section in a suite so cases have somewhere to live. */
  async addSection(
    projectId: number,
    suiteId: number,
    name: string,
    parentId?: number
  ): Promise<TestRailSection | null> {
    const body: Record<string, unknown> = { suite_id: suiteId, name };
    if (parentId !== undefined) body.parent_id = parentId;
    return this.request('POST', `/index.php?/api/v2/add_section/${projectId}`, body);
  }

  /** GET /get_case_fields — lists custom case fields (and their per-project/template configs). */
  async getCaseFields(): Promise<TestRailCaseField[] | null> {
    return this.request('GET', '/index.php?/api/v2/get_case_fields');
  }

  /** GET /get_case_types — lists the system-wide case Type options (e.g. Functional, Regression). */
  async getCaseTypes(): Promise<TestRailCaseType[] | null> {
    return this.request('GET', '/index.php?/api/v2/get_case_types');
  }

  /** GET /get_priorities — lists the system-wide priority options (e.g. Low/Medium/High/Critical). */
  async getPriorities(): Promise<TestRailPriority[] | null> {
    return this.request('GET', '/index.php?/api/v2/get_priorities');
  }

  /** GET /get_templates/{project_id} — lists case templates enabled for a project (Text vs Steps). */
  async getTemplates(projectId: number): Promise<TestRailTemplate[] | null> {
    return this.request('GET', `/index.php?/api/v2/get_templates/${projectId}`);
  }

  /** POST /add_case/{section_id} — creates a test case in the given section (and thus suite). */
  async addCase(
    sectionId: number,
    title: string,
    fields: Record<string, unknown> = {}
  ): Promise<TestRailCase | null> {
    return this.request('POST', `/index.php?/api/v2/add_case/${sectionId}`, { title, ...fields });
  }

  /** POST /add_run/{project_id} — creates a test run in a suite, optionally scoped to specific case IDs. */
  async addRun(
    projectId: number,
    suiteId: number,
    name: string,
    caseIds?: number[]
  ): Promise<TestRailRun | null> {
    const body: Record<string, unknown> = {
      suite_id: suiteId,
      name,
      include_all: !caseIds,
    };
    if (caseIds) body.case_ids = caseIds;

    return this.request('POST', `/index.php?/api/v2/add_run/${projectId}`, body);
  }

  /** POST /add_results_for_cases/{run_id} — publishes pass/fail results for cases in an existing run. */
  async addResultsForCases(runId: number, results: TestRailResultInput[]): Promise<unknown | null> {
    const body = {
      results: results.map((r) => ({
        case_id: r.caseId,
        status_id: STATUS_IDS[r.status],
        comment: r.comment,
      })),
    };

    return this.request('POST', `/index.php?/api/v2/add_results_for_cases/${runId}`, body);
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          Authorization: this.authHeader,
          'Content-Type': 'application/json',
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
        `[TestRailClient] ${method} ${path} failed:`,
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }
}
