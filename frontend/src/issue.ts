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
    :host {
      color: red;
    }
  `;
  render() {
    if (!this.issue) return;
    return html`<p>${this.issue.url}</p>`;
  }
}
