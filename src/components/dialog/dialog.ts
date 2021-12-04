import { Composable } from './../page/page.js';
import { BaseComponent, Component } from './../component.js';

type OnCloseListner = () => void;
type OnSubmitListner = () => void;

export class InputDialog extends BaseComponent<HTMLElement> implements Composable {
    closeListner?: OnCloseListner;
    submitListner?: OnSubmitListner;
    constructor() {
        super(`
        <dialog class="dialog">
        <div class="dialog__container">
            <button class="close">&times;</button>
            <div id="dialog__body"></div>
            <button class="dialog__submit">ADD</button>
        </div>
    </dialog>
    `);
        const closeBtn = this.element.querySelector('.close')! as HTMLElement;
        closeBtn.onclick = () => {
            this.closeListner && this.closeListner();
        };
        const submitBtn = this.element.querySelector('.dialog__submit')! as HTMLElement;
        submitBtn.onclick = () => {
            this.submitListner && this.submitListner();
        };
    }

    setOnCloseListner(listner: OnCloseListner) {
        this.closeListner = listner;
    }

    setOnSubmitListner(listner: OnSubmitListner) {
        this.submitListner = listner;
    }
    addChild(child: Component) {
        const body = this.element.querySelector('#dialog__body')! as HTMLElement;
        child.attachTo(body);
    }
}
