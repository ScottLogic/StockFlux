export default function(responseObject) {
    var message;
    if (responseObject && !responseObject.success) {
        message = responseObject.error.messages.join('; ');
    }
    return message;
}
