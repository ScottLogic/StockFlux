import React, { useCallback } from 'react';
import styles from './Titlebar.module.css';
import { snapAndDock } from 'openfin-layouts';
import useDocked from '../useOpenfin/useDocked';

export default () => {
    const isDocked = useDocked();

    const onMinimizeClick = useCallback(async () => {
        const currentWindow = await window.fin.Window.getCurrent();
        currentWindow.minimize();
    }, []);

    const onCloseClick = useCallback(async () => {
        const currentWindow = await window.fin.Window.getCurrent();
        currentWindow.close();
    }, []);

    const onUndockClick = useCallback(async () => {
        await snapAndDock.undockWindow();
    }, []);

    return (
        <div className={styles.titlebarContainer}>
            <div className={styles.icons}>
                <div className="button-icon minimize" onClick={onMinimizeClick} title="Minimize">&nbsp;</div>
                {isDocked && <div className="button-icon undock" onClick={onUndockClick} title="Undock">&nbsp;</div>}
                <div className="button-icon closeIcon" onClick={onCloseClick} title="Close">&nbsp;</div>
            </div>
        </div>
    )
}
