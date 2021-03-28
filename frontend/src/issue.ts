import {LitElement, html, customElement, property, css} from 'lit-element';
import {Api, Issue} from './api';

@customElement('app-issue')
export class AppIssue extends LitElement {
  @property() issueId = '';
  @property({attribute: false}) issue?: Issue;

  async attributeChangedCallback(
    name: string,
    oldval: string | null,
    newval: string | null
  ) {
    if (name === 'issueid' && newval) this.issue = await Api.issue(newval);

    super.attributeChangedCallback(name, oldval, newval);
  }

  static styles = css`
    .info {
      font-size: 14px;
      color: lightgray;
      .username {
        font-weight: bold;
      }
    }
  `;
  render() {
    const issue = this.issue;
    if (!issue) return;

    const statusText = 'opened this issue';
    const timeText = new Date(Date.parse(issue.created_at)).toLocaleString();

    return html`<article>
      <div class="info">
        <span class="username">${issue.user?.login}</span>
        <span>${statusText} at ${timeText}</span>
      </div>
      <app-markdown-content .body=${issue.body_html!}></app-markdown-content>
    </article>`;
  }
}
