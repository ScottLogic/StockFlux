/*global WebSocket */
import d3 from 'd3';

// https://docs.gdax.com/#websocket-feed

export default function() {

    var product = 'BTC-USD';
    var dispatch = d3.dispatch('open', 'close', 'error', 'message');
    var messageType = 'match';
    var socket;

    var webSocket = function(url, subscribe) {
        url = url || 'wss://ws-feed.gdax.com';
        subscribe = subscribe || {
            'type': 'subscribe',
            'product_id': product
        };

        socket = new WebSocket(url);

        socket.onopen = function(event) {
            socket.send(JSON.stringify(subscribe));
            dispatch.open(event);
        };
        socket.onerror = function(event) {
            dispatch.error(event);
        };
        socket.onclose = function(event) {
            dispatch.close(event);
        };
        socket.onmessage = function(event) {
            var msg = JSON.parse(event.data);
            if (msg.type === messageType) {
                dispatch.message(msg);
            } else if (msg.type === 'error') {
                dispatch.error(msg);
            }
        };
    };

    d3.rebind(webSocket, dispatch, 'on');

    webSocket.close = function() {
        // Only close the WebSocket if it is opening or open
        if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN)) {
            socket.close();
        }
    };

    webSocket.messageType = function(x) {
        if (!arguments.length) {
            return messageType;
        }
        messageType = x;
        return webSocket;
    };

    webSocket.product = function(x) {
        if (!arguments.length) {
            return product;
        }
        product = x;
        return webSocket;
    };

    return webSocket;
}
