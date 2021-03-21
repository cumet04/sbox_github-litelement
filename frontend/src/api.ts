import {Endpoints} from '@octokit/types';

// refs https://octokit.github.io/types.ts/interfaces/generated_endpoints.endpoints.html
export type Issue = Endpoints['GET /repos/{owner}/{repo}/issues/{issue_number}']['response']['data'];

function get<T>(path: string) {
  return fetch(`/api${path}`).then(resp => resp.json() as Promise<T>);
  // TODO: error handling
}

export const Api = {
  issue: (issueId: string) => get<Issue>(`/${issueId}`),
};
