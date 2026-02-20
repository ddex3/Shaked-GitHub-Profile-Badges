import https from 'https';

const BASE_URL = 'https://api.github.com';

export interface GitHubUser {
  login: string;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  created_at: string;
  updated_at: string;
}

interface GitHubRepo {
  stargazers_count: number;
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

function request<T>(path: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const headers: Record<string, string> = {
      'User-Agent': 'shaked-github-profile-info/1.0.0',
      Accept: 'application/vnd.github.v3+json',
    };

    const req = https.request(
      `${BASE_URL}${path}`,
      { headers, timeout: 10_000 },
      (res) => {
        if (res.statusCode === 404) {
          res.resume();
          reject(new NotFoundError('GitHub user not found'));
          return;
        }

        if (res.statusCode === 403 || res.statusCode === 429) {
          res.resume();
          reject(new RateLimitError('GitHub API rate limit exceeded'));
          return;
        }

        if (res.statusCode && res.statusCode >= 400) {
          res.resume();
          reject(new Error(`GitHub API responded with status ${res.statusCode}`));
          return;
        }

        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')) as T);
          } catch {
            reject(new Error('Failed to parse GitHub API response'));
          }
        });
        res.on('error', reject);
      },
    );

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('GitHub API request timed out'));
    });

    req.on('error', reject);
    req.end();
  });
}

export async function getUser(username: string): Promise<GitHubUser> {
  return request<GitHubUser>(`/users/${encodeURIComponent(username)}`);
}

export async function getUserTotalStars(username: string): Promise<number> {
  let page = 1;
  let total = 0;

  while (true) {
    const repos = await request<GitHubRepo[]>(
      `/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}`,
    );

    if (!repos.length) break;

    total += repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    if (repos.length < 100) break;
    page++;
  }

  return total;
}
