// Exposes an API that the parent window uses to set dragging state and return 
// callbacks 
(function(window) {
    'use strict';

    // The API object to be exposed 
    var dropTargetAPI = {};

    // When moving, this will be the element in the parent that is checked for 
    // position to determine whether or not to fire the dropCallback
    var dropTarget,
        // Initially setup the callbacks as noops
        dropCallback = function() {},
        closeCallback = function() {},
        initialDragOver = false;

    // Allow the parent to set the drop target 
    dropTargetAPI.setDropTarget = function(element) {
        dropTarget = element;
    };

    // Allow the parent to set the initial dragover state (initially false, this 
    // gets set to false on the drop or close callback)
    dropTargetAPI.setInitialDragOver = function(state) {
        initialDragOver = state;
    };

    // Allow the parent to set the drop callback to be executed on drop
    dropTargetAPI.setDropCallback = function(callback) {
        dropCallback = callback;
    };

    // Allow the parent to set the close callback to be executed on the OpenFin
    // `close-requested` event 
    dropTargetAPI.setCloseCallback = function(callback) {
        closeCallback = callback;
    };

    // Convenience funciton that grabs the height, width, top, and left off 
    // a window object  
    var getWindowPosition = function(windowElement) {
        return {
            height: windowElement.outerHeight,
            width: windowElement.outerWidth,
            top: windowElement.screenY,
            left: windowElement.screenX
        };
    };

    // Calculate the screen position of an element 
    var elementScreenPosition = function(windowElement, element) {
        var relativeElementPosition = element.getBoundingClientRect();
        return {
            height: relativeElementPosition.height,
            width: relativeElementPosition.width,
            top: windowElement.top + relativeElementPosition.top,
            left: windowElement.left + relativeElementPosition.left
        };
    };

    fin.desktop.main(function() {
        var currentWindow = fin.desktop.Window.getCurrent();

        // On the `bounds-changing` event check to see if you are over a 
        // potential drop target. If you are and and it is not the initial drag
        // out, fire the dropCallBack
        currentWindow.addEventListener('bounds-changing', function() {

            // Check if you are over a drop target by seeing if the tearout 
            // rectangle intersects the drop target  
            var overDropTarget = geometry.rectangle(getWindowPosition(window))
                .intersects(
                    geometry.rectangle(
                        elementScreenPosition(
                            getWindowPosition(opener), dropTarget)));

            if (overDropTarget && initialDragOver) {
                dropCallback();
            }
        });


        // When the user clicks the close button, instead of terminating the 
        // window, we call the registerd close callback and hide it
        currentWindow.addEventListener('close-requested', function() {
            closeCallback();
            currentWindow.hide();
        });
    });

    window.dropTargetAPI = dropTargetAPI;
})(window);
