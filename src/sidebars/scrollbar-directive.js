(function() {
    'use strict';

    angular.module('stockflux.scroll')
        .directive('customScrollbar', [() => {
            return {
                restrict: 'C',
                link: (scope, element) => {
                    var scrollPadding = 'scroll-padding';
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
