export default function(initialDiscontinuityProvider) {
    return {
        data: [],
        viewDomain: [],
        trackingLatest: true,
        discontinuityProvider: initialDiscontinuityProvider
    };
}
