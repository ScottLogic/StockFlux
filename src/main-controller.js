(function() {
    'use strict';

    angular.module('openfin.main', [])
        .controller('MainCtrl', [function() {
            var self = this;

            self.selection = '';

            self.select = function(stock) {
                self.selection = stock.code;
            };
        }]);
}());
