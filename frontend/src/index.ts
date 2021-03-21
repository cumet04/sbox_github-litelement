import {LitElement, html, customElement} from 'lit-element';
import './issue';

@customElement('app-root')
export class App extends LitElement {
  render() {
    return html`<app-issue issueId="rails/rails/41659" />`;
  }
}
