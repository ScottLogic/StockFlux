import { useState, useEffect } from 'react';

export default () => {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        const setIsMaximizedTrue = () => setIsMaximized(true);
        const setIsMaximizedFalse = () => setIsMaximized(false);

        const currentWindow = window.fin.desktop.Window.getCurrent();

        currentWindow.addEventListener('maximized', setIsMaximizedTrue);
        currentWindow.addEventListener('restored', setIsMaximizedFalse);

        return () => {
            currentWindow.removeEventListener('maximized', setIsMaximizedTrue);
            currentWindow.removeEventListener('restored', setIsMaximizedFalse);
        };
    }, []);

    return isMaximized;
};
