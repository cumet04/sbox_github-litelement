import {LitElement, html, customElement, property, css} from 'lit-element';

@customElement('app-root')
export class App extends LitElement {
  @property()
  msg = 'foo';

  static styles = css`
    :host {
      color: red;
    }
  `;
  render() {
    return html`<p>${this.msg}</p>`;
  }
}
