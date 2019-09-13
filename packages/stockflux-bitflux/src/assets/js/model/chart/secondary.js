export default function(initialProduct, initialDiscontinuityProvider) {
    return {
        data: [],
        visibleData: [],
        viewDomain: [],
        trackingLatest: true,
        product: initialProduct,
        discontinuityProvider: initialDiscontinuityProvider,
        indicators: []
    };
}
