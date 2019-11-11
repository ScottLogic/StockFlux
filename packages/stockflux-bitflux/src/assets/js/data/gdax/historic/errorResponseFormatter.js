export default function(responseObject) {
  var message;
  if (responseObject) {
    message = responseObject.message;
  }
  return message;
}
