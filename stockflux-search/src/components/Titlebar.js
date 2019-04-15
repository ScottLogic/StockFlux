import React, { useCallback } from 'react';
import styles from './Titlebar.module.css';

export default function Titlebar(props) {
    const onMinimizeClick = useCallback(async () => {
        const currentWindow = await window.fin.Window.getCurrent();
        currentWindow.minimize();
    }, []);

    const onCloseClick = useCallback(async () => {
        const currentWindow = await window.fin.Window.getCurrent();
        currentWindow.close();
    }, []);

    return (
        <div className={styles.titlebarContainer}>
            <div className={styles.icons}>
                <div className="button-icon minimize" onClick={onMinimizeClick} title="Minimize">&nbsp;</div>
                <div className="button-icon closeIcon" onClick={onCloseClick} title="Close">&nbsp;</div>
            </div>
        </div>
    )
}
