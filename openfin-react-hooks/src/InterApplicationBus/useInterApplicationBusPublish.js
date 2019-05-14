import { useState, useEffect } from 'react';

export default (topic, message) => {
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const onSuccess = () => {
        setSuccess(true);
    };

    const onFail = error => {
        setError(error);
        setSuccess(false);
    }

    useEffect(() => {
        // check for openfin api on window
        const { InterApplicationBus } = window.fin;
        if (!InterApplicationBus) return;
        InterApplicationBus.publish(topic, message).then(() => onSuccess()).catch(error => onFail(error));
        return;
    }, [topic, message]);

    return {success, error};
};