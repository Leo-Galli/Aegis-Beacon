/** GitHub contributors for Leo-Galli/Aegis-Beacon (build-time fetch). */

export interface Contributor {
  login: string;
  avatarUrl: string;
  profileUrl: string;
  contributions: number;
}

const REPO = 'Leo-Galli/Aegis-Beacon';

/** Bot / automation accounts excluded from the public contributors page. */
const EXCLUDED_LOGINS = new Set(['code' + 'buff-team', 'github-actions']);

interface GitHubContributorRow {
  login: string | null;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

function isExcluded(login: string): boolean {
  return EXCLUDED_LOGINS.has(login.toLowerCase());
}

/** Fetch all repository contributors, paginated, with bots filtered out. */
export async function fetchGitHubContributors(): Promise<Contributor[]> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Aegis-Beacon-Website',
  };

  const token = import.meta.env.GITHUB_TOKEN;
  if (typeof token === 'string' && token.length > 0) {
    headers.Authorization = `Bearer ${token}`;
  }

  const rows: GitHubContributorRow[] = [];
  let page = 1;

  while (page <= 10) {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contributors?anon=0&per_page=100&page=${page}`,
      { headers }
    );

    if (!res.ok) {
      throw new Error(`GitHub contributors API failed (${res.status})`);
    }

    const batch = (await res.json()) as GitHubContributorRow[];
    if (!Array.isArray(batch) || batch.length === 0) break;

    rows.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }

  return rows
    .filter((row) => row.login && row.type === 'User' && !isExcluded(row.login))
    .map((row) => ({
      login: row.login as string,
      avatarUrl: row.avatar_url,
      profileUrl: row.html_url,
      contributions: row.contributions,
    }))
    .sort((a, b) => b.contributions - a.contributions);
}
