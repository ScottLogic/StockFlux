// Inspired by underscore library implementation of debounce

export default function(func, wait, immediate) {
    var timeout;
    var args;
    var timestamp;
    var result;

    var later = function() {
        var last = new Date().getTime() - timestamp;

        if (last < wait && last >= 0) {
            timeout = setTimeout(later.bind(this), wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(this, args);
                args = null;
            }
        }
    };

    return function() {
        args = arguments;
        timestamp = new Date().getTime();
        var callNow = immediate && !timeout;

        if (!timeout) {
            timeout = setTimeout(later.bind(this), wait);
        }
        if (callNow) {
            result = func.apply(this, args);
            args = null;
        }

        return result;
    };
}
