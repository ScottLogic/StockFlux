(function() {
    'use strict';

    angular.module('openfin.scroll')
        .directive('customScrollbar', [() => {
            return {
                restrict: 'C',
                link: function(scope, element) {
                    var scrollPadding = 'scrollPadding';
                    element.mCustomScrollbar(
                        {
                            callbacks: {
                                onOverflowY: () => {
                                    element.addClass(scrollPadding);
                                },
                                onOverflowYNone: () => {
                                    element.removeClass(scrollPadding);
                                }
                            }
                        }
                    );
                }
            };
        }]);
}());
