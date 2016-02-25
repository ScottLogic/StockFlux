(function() {
    'use strict';

    angular.module('openfin.scroll')
        .directive('customScrollbar', [() => {
            return {
                restrict: 'C',
                link: (scope, element) => {
                    var scrollPadding = 'scrollPadding';
                    element.mCustomScrollbar(
                        {
                            scrollInertia: 0,
                            mouseWheel: {
                                scrollAmount: 80
                            },
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
