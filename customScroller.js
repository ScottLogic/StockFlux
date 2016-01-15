(function($) {
    $(window).load(function() {
        $('#searchScroll').mCustomScrollbar();
        var favScroll = $('#favScroll');
        var scrollPadding = 'scrollPadding';
        favScroll.mCustomScrollbar(
            {
                callbacks: {
                    onOverflowY: function() {
                        favScroll.addClass(scrollPadding);
                    },
                    onOverflowYNone: function() {
                        favScroll.removeClass(scrollPadding);
                    }
                }
            }
        );
    });
})(jQuery);
