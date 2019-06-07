// Inspired by underscore library implementation of throttle

export default function(func, wait, options) {
    var args;
    var result;
    var timeout = null;
    var previous = 0;

    if (!options) {
        options = {};
    }

    var later = function() {
        if (options.leading === false) {
            previous = 0;
        } else {
            previous = new Date().getTime();
        }

        timeout = null;
        result = func.apply(this, args);

        if (!timeout) {
            args = null;
        }
    };

    return function() {
        var now = new Date().getTime();

        if (!previous && options.leading === false) {
            previous = now;
        }

        var remaining = wait - (now - previous);
        args = arguments;

        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(this, args);

            if (!timeout) {
                args = null;
            }
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later.bind(this), remaining);
        }

        return result;
    };
}
