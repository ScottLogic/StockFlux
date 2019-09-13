export const createWindow = async windowOptions => {
    return await window.fin.Window.create(windowOptions);
}

export const getCurrentWindow = async () => {
    return await window.fin.Window.getCurrent();
}

export const getCurrentWindowSync = () => {
    return window.fin.Window.getCurrentSync();
}