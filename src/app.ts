import { ImageComponent } from './components/page/item/image.js';
import { VideoComponent } from './components/page/item/video.js';
import { NoteComponent } from './components/page/item/note.js';
import { ToDoComponent } from './components/page/item/todo.js';
import { PageComponent, Composable } from './components/page/page.js';
import { Component } from './components/component.js';

class App {
    private readonly page: Component & Composable;
    constructor(appRoot: HTMLElement) {
        this.page = new PageComponent();
        this.page.attachTo(appRoot);

        const image = new ImageComponent('Image Title', 'https://picsum.photos/600/300');
        this.page.addChild(image);

        const video = new VideoComponent('Video Title', 'https://www.youtube.com/watch?v=dz-3A9Sz7O4');
        this.page.addChild(video);

        const note = new NoteComponent('Note Title', 'Note Body');
        this.page.addChild(note);

        const todo = new ToDoComponent('Todo Title', 'Todo Item');
        this.page.addChild(todo);
    }
}

new App(document.querySelector('.document')! as HTMLElement);
