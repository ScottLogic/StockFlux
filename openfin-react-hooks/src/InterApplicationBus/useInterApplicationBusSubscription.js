import { useState, useEffect } from 'react';

export default (senderUuid, name = null, topic) => {
    const [data, setData] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribeError, setSubscribeError] = useState(null);

    const onReceiveMessage = (...args) => {
        setData(args);
    };

    const onSuccess = isSubscribing => {
        setIsSubscribed(isSubscribing);
    };

    const onFail = (isSubscribing, error) => {
        setSubscribeError(error);
        setIsSubscribed(!isSubscribing);
    }
    
    useEffect(() => {
        if (isSubscribed) return () => null;
        // check for openfin api on window
        const { InterApplicationBus } = window.fin;

        if (!InterApplicationBus) {
            return () => null;
        }
        const subscribeSource = {
            uuid: senderUuid
        };


        InterApplicationBus.subscribe(
            subscribeSource,
            topic, 
            onReceiveMessage
        ).then(
            () => onSuccess(true)
        ).catch(
            error => onFail(true, error)
        );


        return () => {
            InterApplicationBus.unsubscribe(
                subscribeSource,
                topic, 
                onReceiveMessage
                ).then(
                    () => onSuccess(false)
                ).catch(
                    error => onFail(true, error)
            );
        };
    }, [senderUuid, name, topic]);

    return {data, subscribeError, isSubscribed};
};