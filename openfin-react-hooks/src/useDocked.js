import { useState, useEffect } from 'react';

import { snapAndDock } from 'openfin-layouts';

export default () => {
    const [isDocked, setIsDocked] = useState(false);

    useEffect(() => {
        const setIsDockedTrue = () => setIsDocked(true);
        const setIsDockedFalse = () => setIsDocked(false);

        snapAndDock.addEventListener('window-docked', setIsDockedTrue);
        snapAndDock.addEventListener('window-undocked', setIsDockedFalse);

        return () => {
            snapAndDock.removeEventListener('window-docked', setIsDockedTrue);
            snapAndDock.removeEventListener('window-undocked', setIsDockedFalse);
        };
    }, []);

    return isDocked;
};
