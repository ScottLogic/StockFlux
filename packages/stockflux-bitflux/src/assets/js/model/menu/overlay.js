import dropdownConfig from './dropdownConfig';

export default function(initialProducts, initialSelectedProduct) {
    return {
        primaryIndicators: [],
        secondaryIndicators: [],
        productConfig: dropdownConfig(),
        products: initialProducts,
        selectedProduct: initialSelectedProduct
    };
}

