import model from '../../model/model';

export default function(products, source, defaultPeriods, productPeriodOverrides) {
    return products.map(function(product) {
        return model.data.product(product.id, product.id,
            productPeriodOverrides.get(product.id) || defaultPeriods, source);
    });
}
