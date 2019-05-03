import dropdownConfig from './dropdownConfig';

export default function(initialProducts, initialSelectedProduct, initialSelectedPeriod) {
    return {
        productConfig: dropdownConfig(null, true),
        mobilePeriodConfig: dropdownConfig(),
        products: initialProducts,
        selectedProduct: initialSelectedProduct,
        selectedPeriod: initialSelectedPeriod,
        alertMessages: [],
        primaryIndicators: [],
        secondaryIndicators: []
    };
}
