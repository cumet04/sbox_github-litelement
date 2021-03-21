function get(path: string) {
  return fetch(`/api${path}`)
    .then(resp => resp.json())
    .catch(err => console.error(err));
}

export const Api = {
  issue: (issueId: string) => get(`/${issueId}`),
};
