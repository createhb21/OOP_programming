import { BaseComponent } from '../../component.js';

export class NoteComponent extends BaseComponent<HTMLElement> {
    constructor(title: string, body: string) {
        super(`
        <section class="note">
          <h3 class="note__title"></h3>
          <p class="note__body"></p>
        </section>`);

        const titleElement = this.element.querySelector('.note__title')! as HTMLHeadingElement;
        titleElement.textContent = title;

        const bodyElement = this.element.querySelector('.note__title')! as HTMLParagraphElement;
        bodyElement.textContent = body;
    }
}
