import util from '../../util/util';

export default function(message) {
    return {
        id: util.uid(),
        message: message
    };
}
