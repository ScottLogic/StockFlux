var tearout = tearout || {};
(function() {
    'use strict';

    // Bootstrapping the tearout process
    // -----
    // The basic idea here is to attach listeners to the element to be dragged 
    // that react to mouse events in order to facilitate the tearout process. 
    //
    // On a mousedown event, we grab our destination tearout window and inject 
    // the DOM element to be torn out. Also on this event we set callbacks on the 
    // tearout window that will allow us to react to close events and drag backs 
    //
    // On a mousemove event, if we are in a dragging state, move the torn out window 
    // programmatically. 
    //
    // On a mouseup event we reset the internal state to be ready for the next 
    // dragging event 
    tearout.initialise = function(config) {
        var me = {
            currentlyDragging: false,
            moveEventOccured: false,
            inTearout: false,
            offsetX: 0,
            offsetY: 0,
            element: config.element,
            tearoutWindow: config.tearoutWindow,
            dropTarget: config.dropTarget || null
        },
            // Here we want to be able to continue to receive mouse move events 
            // outside the window borders via 
            // [setCapture](https://developer.mozilla.org/en-US/docs/Web/API/Element.setCapture)
            dragTarget = config.element.setCapture ? config.element : document;

        // This is the distance from where the mouse click occurred to left 0 of the
        // element. We use this to place the tearout window exactly over the tearout
        // element   
        me.setOffsetX = function(x) {
            me.offsetX = x;
            return me;
        };

        // This is the distance from where the mouse click occured to left 0 of the
        // element.
        me.setOffsetY = function(y) {
            me.offsetY = y;
            return me;
        };

        // A flag used to indicate if the dom element has been 
        // transfered to the tearout yet or not 
        me.setInTearout = function(state) {
            me.inTearout = state;
            return me;
        };

        // A flag used to know when the mousemove events should trigger a 
        // programmatic move of the tearout window 
        me.setCurrentlyDragging = function(dragging) {
            me.currentlyDragging = dragging;
            return me;
        };

        // Make a call to setCapture on the element in order to be able to receive 
        // mousemove events outside of the main browser window 
        me.setElementCapture = function() {
            if (me.element.setCapture) {
                me.element.setCapture();
            }
            return me;
        };

        // A flag used to indicate if the mouse moved after a mouse down event
        me.setMoveEventOccured = function(state) {
            me.moveEventOccured = state;
            return me;
        };

        // A call to the OpenFin API to move the tearout window 
        me.moveDropTarget = function(x, y) {
            me.tearoutWindow.moveTo(x, y);
            return me;
        };

        // A call to the OpenFin API to both show the tearout window and ensure that 
        // it is displayed in the foreground 
        me.displayDropTarget = function() {
            me.tearoutWindow.show();
            me.tearoutWindow.setAsForeground();
            return me;
        };

        // A call to the OpenFin API to hide the tearout window 
        me.hideDropTarget = function() {
            me.tearoutWindow.hide();
            return me;
        };

        // Inject the content of the tearout into the new window 
        me.appendToOpenfinWindow = function(injection, openfinWindow) {
            openfinWindow
                .contentWindow
                .document
                .body
                .appendChild(injection);

            return me;
        };

        // Grab the dom element back from the tearout and append its original 
        // container 
        me.appendElementBackFromTearout = function() {
            me.dropTarget.appendChild(me.element);
            return me;
        };

        // In our example, there is an API object in the tearout window that allows 
        // the parent to set up drop targets and close callbacks 
        me.callTearoutWindowFunction = function(functionName, args) {
            var tearoutWindow = me.tearoutWindow
                .getNativeWindow(),
                dropTargetAPI = tearoutWindow.dropTargetAPI,
                remoteDropFunction = dropTargetAPI && dropTargetAPI[functionName];

            if (remoteDropFunction) {
                remoteDropFunction.apply(tearoutWindow, args);
            }

            return me;
        };

        // Clear out all the elements but keep the js context ;) 
        me.clearIncomingTearoutWindow = function() {

            me.tearoutWindow
                .getNativeWindow()
                .document
                .body = me.tearoutWindow
                .getNativeWindow()
                .document.createElement('body');
            return me;
        };

        // The actions to be taken when the tearout window is dragged back in or 
        // closed. This function gets registered as a callback from the tearout 
        // window
        me.returnFromTearout = function() {
            me.hideDropTarget()
                .appendElementBackFromTearout()
                .setInTearout(false)
                .callTearoutWindowFunction('setInitialDragOver', [false]);
        };

        //	When an element is being dragged, do not allow background elements to be 
        //	selected. This prevents problems when dragging back in while the browser
        //	still thinks that the there is a focused/selected element 
        me.disableDocumentElementSelection = function() {
            var style = document.body.style;
            style.cssText = style.cssText + '-webkit-user-select: none';
            return me;
        };

        // Renable selection on the entire page 
        me.enableDocumentElementSelection = function() {
            var style = document.body.style;
            style.cssText = style.cssText.replace('-webkit-user-select: none', '');
            return me;
        };


        //	Mouse Event Handlers
        //---
        //
        // `handleMouseDown` is the function assigned to the native `mousedown` 
        // event on the element to be torn out. The param `e` is the native event 
        // passed in by the event listener. The steps taken are as follows:
        // * Set the capture on the element to be able know mouse position 
        // * Disable selection on the page not to select items while dragging 
        // * Set the X and Y offsets to better position the tearout window 
        // * Move the tearout window into position
        // * Clear out any DOM elements that may already be in the tearout window 
        // * Move the DOM element to be torn out into the tearout 
        // * Set the inTearout flag to true 
        // * Display the tearout window in the foreground 
        // * Register the potential drop target and return callbacks on the tearout 
        me.handleMouseDown = function(e) {

            if (!me.inTearout) {
                me.tearoutWindow.resizeTo(284, 119);
            }

            // If already in a tearout, or the src element is not the base element 
            // passed to be made tearout-able do nothing

            if (me.inTearout || (e.srcElement !== me.element && !e.srcElement.classList.contains('tearable'))) {
                return false;
            }

            me.setCurrentlyDragging(true)
                .setElementCapture()
                .disableDocumentElementSelection()
                .setOffsetX(e.offsetX)
                .setOffsetY(e.offsetY)
                .moveDropTarget(e.screenX - me.offsetX, e.screenY - me.offsetY)
                .clearIncomingTearoutWindow()
                .appendToOpenfinWindow(me.element, me.tearoutWindow)
                .setInTearout(true)
                .displayDropTarget()
                .callTearoutWindowFunction('setDropTarget', [me.dropTarget])
                .callTearoutWindowFunction('setDropCallback', [me.returnFromTearout])
                .callTearoutWindowFunction('setCloseCallback', [me.returnFromTearout]);
        };

        // `handleMouseMove` is the function assigned to the `mousemove` event on 
        // the element to be torn out (or `document` if setCapture is not available 
        // on the desired tearout element). The param `e` is the native event passed
        // in by the event listener. If the `currentlyDragging` flag is true, 
        // indicate that move event occurred and move the tearout window 
        me.handleMouseMove = function(e) {

            if (me.currentlyDragging) {
                me.setMoveEventOccured(true)
                    .moveDropTarget(e.screenX - me.offsetX, e.screenY - me.offsetY);
            }
        };

        // `handleMouseUp` is the function assigned to the `mouseup` event on 
        // the element to be torn out (or `document` if setCapture is not available 
        // on the desired tearout element). We do not want to set the 
        // `initialDragOver` flag on the tearout window if there were no mouse move 
        // events. this prevents us from being sucked back into the drop target 
        // after clicking on a non-dragable selection 

        me.handleMouseUp = function() {
            me.setCurrentlyDragging(false)
                .enableDocumentElementSelection();

            if (me.moveEventOccured) {
                me.callTearoutWindowFunction('setInitialDragOver', [true]);
            }

            me.setMoveEventOccured(false);

            // TODO: This is where we called .appendToOpenFinWindow with a new
            // element for the larger window, keeping careful to not modify me.element
            // so that it returns correctly when the window is re-docked

            me.tearoutWindow.animate({
                size: {
                    width: 400,
                    height: 300,
                    duration: 300
                }
            });
        };


        // Register Handlers
        // ----
        me.element.addEventListener('mousedown', me.handleMouseDown);
        dragTarget.addEventListener('mousemove', me.handleMouseMove, true);
        dragTarget.addEventListener('mouseup', me.handleMouseUp, true);
    };
}());

