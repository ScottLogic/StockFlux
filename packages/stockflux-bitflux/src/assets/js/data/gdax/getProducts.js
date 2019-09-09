import d3 from 'd3';

export default function(callback) {
    d3.json('https://api.gdax.com/products', function(error, response) {
        if (error) {
            callback(error);
            return;
        }
        callback(error, response);
    });
}
