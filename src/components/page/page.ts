import { BaseComponent, Component } from '../component.js';

export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListner = () => void;
type DragState = 'start' | 'stop' | 'enter' | 'leave';
type OnDragStateListner<T extends Component> = (
  target: T,
  state: DragState,
) => void;

interface SectionContainer extends Component, Composable {
  setOnCloseListner(listner: OnCloseListner): void;
  setOnDragStateListner(listner: OnDragStateListner<SectionContainer>): void;
  muteChildren(state: 'mute' | 'unmute'): void;
  getBoundingRect(): DOMRect;
  onDropped(): void;
}

type SectionContainerConstructor = {
  new (): SectionContainer;
};

export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements SectionContainer
{
  private closeListner?: OnCloseListner;
  private dragStateListner?: OnDragStateListner<PageItemComponent>;

  constructor() {
    super(`
        <li draggable="true" class="page-item">
            <section class="page-item__body"></section>
            <div class="page-item__controls">
                <button class="close">&times;</button>
            </div>
        </li>`);
    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListner && this.closeListner();
    };
    this.element.addEventListener('dragstart', (event: DragEvent) => {
      this.onDragStart(event);
    });
    this.element.addEventListener('dragend', (event: DragEvent) => {
      this.onDragEnd(event);
    });
    this.element.addEventListener('dragenter', (event: DragEvent) => {
      this.onDragEnter(event);
    });
    this.element.addEventListener('dragleave', (event: DragEvent) => {
      this.onDragLeave(event);
    });
  }

  onDragStart(_: DragEvent) {
    this.nofifyDragObservers('start');
    this.element.classList.add('lifted');
  }
  onDragEnd(_: DragEvent) {
    this.nofifyDragObservers('stop');
    this.element.classList.remove('lifted');
  }
  onDragEnter(_: DragEvent) {
    this.nofifyDragObservers('enter');
    this.element.classList.add('drop-area');
  }
  onDragLeave(_: DragEvent) {
    this.nofifyDragObservers('leave');
    this.element.classList.remove('drop-area');
  }

  onDropped() {
    this.element.classList.remove('drop-area');
  }

  nofifyDragObservers(state: DragState) {
    this.dragStateListner && this.dragStateListner(this, state);
  }
  addChild(child: Component) {
    const container = this.element.querySelector(
      '.page-item__body',
    )! as HTMLElement;
    child.attachTo(container);
  }
  setOnCloseListner(listner: OnCloseListner) {
    this.closeListner = listner;
  }

  setOnDragStateListner(listner: OnDragStateListner<PageItemComponent>) {
    this.dragStateListner = listner;
  }

  muteChildren(state: 'mute' | 'unmute') {
    if (state === 'mute') {
      this.element.classList.add('mute-children');
    } else {
      this.element.classList.remove('mute-children');
    }
  }

  getBoundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
}
export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  private children = new Set<SectionContainer>();
  private dropTarget?: SectionContainer;
  private dragTarget?: SectionContainer;

  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super('<ul class="page"></ul>');

    this.element.addEventListener('dragover', (event: DragEvent) => {
      this.onDragOver(event);
    });
    this.element.addEventListener('drop', (event: DragEvent) => {
      this.onDrop(event);
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!this.dropTarget) {
      return;
    }
    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dropY = event.clientY;
      const srcElement = this.dragTarget.getBoundingRect();
      this.dragTarget.removeFrom(this.element);
      this.dropTarget.attach(
        this.dragTarget,
        dropY < srcElement.y ? 'beforebegin' : 'afterend',
      );
      this.dropTarget.onDropped();
    }
  }

  addChild(section: Component) {
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
    item.setOnCloseListner(() => {
      item.removeFrom(this.element);
      this.children.delete(item);
    });
    this.children.add(item);
    item.setOnDragStateListner((target: SectionContainer, state: DragState) => {
      switch (state) {
        case 'start':
          this.dragTarget = target;
          this.updateSections('mute');
          break;
        case 'stop':
          this.dragTarget = undefined;
          this.updateSections('unmute');
          break;
        case 'enter':
          this.dropTarget = target;
          break;
        case 'leave':
          this.dropTarget = undefined;
          break;
        default:
          throw new Error(`unsupported state: ${state}`);
      }
    });
  }
  private updateSections(state: 'mute' | 'unmute') {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state);
    });
  }
}
