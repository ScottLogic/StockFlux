import React from 'react';

const defaultWindowOptions = {
    customData: {
        hello: 'world',
    },
    url: 'context-menu.html',
    shadow: true,
    showTaskbarIcon: false,
    autoShow: false,
    saveWindowState: false,
    defaultWidth: 200,
    defaultHeight: 200,
    alwaysOnTop: true,
    frame: false,
    resizable: false,
    maximizable: false,
    defaultLeft: 200,
    defaultTop: 200
};

const transition = (isIn) => ({
    opacity: {
        opacity: isIn ? 1 : 0,
        duration: 100
    }
});

class ContextMenu {
    static transitionIn = transition(true);
    static transitionOut = transition(false);

    constructor() {
        this.window = null;
        this.isVisible = false;
    }

    initialise = async () => {
        const name = (Math.random() * 1000).toString(); // TODO: make counter?
        this.window = await window.fin.Window.create({ ...defaultWindowOptions, name });
        return this;
    };

    outerHeight() {

    }

    setContent(items) {
        console.log('set content', items);
        return this.window.updateOptions({
            customData: {
                items
            }
        });
    }

    showAt(point, shouldFocus) {
        this.window.show();
        this.window.moveTo(point.x, point.y);
        this.isVisible = true;

        if (shouldFocus) {
            this.window.focus();
        }

        this.window.animate(ContextMenu.transitionIn, { interrupt: true, tween: 'ease-in' });
    }

    hide() {
        this.isVisible = false;
        this.window.animate(ContextMenu.transitionOut, { interrupt: true, tween: 'ease-out' });
    }

    destroy() {
        this.window.close();
    }
}

let contextMenu = null;

window.onunload = async () => {
    await contextMenu.destroy();
};

export default async (position, items) => {
    if (!contextMenu) {
        contextMenu = new ContextMenu();
        await contextMenu.initialise();
    }
    await contextMenu.setContent(items);
    contextMenu.showAt(position, true);
}
