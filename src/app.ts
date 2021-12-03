import { ImageComponent } from './components/page/item/image.js';
import { VideoComponent } from './components/page/item/video.js';
import { NoteComponent } from './components/page/item/note.js';
import { ToDoComponent } from './components/page/item/todo.js';
import { PageComponent } from './components/page/page.js';

class App {
    private readonly page: PageComponent;
    constructor(appRoot: HTMLElement) {
        this.page = new PageComponent();
        this.page.attachTo(appRoot);

        const image = new ImageComponent('Image Title', 'https://picsum.photos/600/300');
        image.attachTo(appRoot, 'beforeend');

        const video = new VideoComponent('Video Title', 'https://www.youtube.com/watch?v=dz-3A9Sz7O4');
        video.attachTo(appRoot, 'beforeend');

        const note = new NoteComponent('Note Title', 'Note Body');
        note.attachTo(appRoot, 'beforeend');

        const todo = new ToDoComponent('Todo Title', 'Todo Item');
        todo.attachTo(appRoot, 'beforeend');
    }
}

new App(document.querySelector('.document')! as HTMLElement);
