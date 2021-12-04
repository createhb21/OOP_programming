import { BaseComponent, Component } from '../component.js';

export interface Composable {
    addChild(child: Component): void;
}

type OnCloseListner = () => void;

interface SectionContainer extends Component, Composable {
    setOnCloseListner(listner: OnCloseListner): void;
}

type SectionContainerConstructor = {
    new (): SectionContainer;
};

export class PageItemComponent extends BaseComponent<HTMLElement> implements SectionContainer {
    private closeListner?: OnCloseListner;

    constructor() {
        super(`
        <li class="page-item">
            <section class="page-item__body"></section>
            <div class="page-item__controls">
                <button class="close">&times;</button>
            </div>
        </li>`);
        const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
        closeBtn.onclick = () => {
            this.closeListner && this.closeListner();
        };
    }

    addChild(child: Component) {
        const container = this.element.querySelector('.page-item__body')! as HTMLElement;
        child.attachTo(container);
    }
    setOnCloseListner(listner: OnCloseListner) {
        this.closeListner = listner;
    }
}
export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
    constructor(private pageItemConstructor: SectionContainerConstructor) {
        super('<ul class="page"></ul>');
    }

    addChild(section: Component) {
        const item = new this.pageItemConstructor();
        item.addChild(section);
        item.attachTo(this.element, 'beforeend');
        item.setOnCloseListner(() => {
            item.removeFrom(this.element);
        });
    }
}
