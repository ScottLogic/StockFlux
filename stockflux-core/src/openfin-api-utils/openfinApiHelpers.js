export const createWindow = async windowOptions => {
    return await window.fin.Window.create(windowOptions);
}