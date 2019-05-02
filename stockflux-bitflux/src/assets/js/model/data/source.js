export default function(historicFeed, historicNotificationFormatter, streamingFeed, streamingNotificationFormatter, discontinuityProvider) {
    return {
        historicFeed: historicFeed,
        historicNotificationFormatter: historicNotificationFormatter,
        streamingFeed: streamingFeed,
        streamingNotificationFormatter: streamingNotificationFormatter,
        discontinuityProvider: discontinuityProvider
    };
}
