import {LitElement, html, customElement} from 'lit-element';
import './issue';
import './markdownContent';

@customElement('app-root')
export class App extends LitElement {
  render() {
    return html`<app-issue issueId="rails/rails/41659" />`;
  }
}
