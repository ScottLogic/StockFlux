# Test Plan
## Assumptions/Luxuries
You should really run full view tests using the full screen of the computer being tested AND also at a reduced size of perhaps 50% of the screen size to improve the quality of the results
The assumption is that right click is disabled and in any instance should always produce no effect.
Hover on means to move mouse cursor over an element.
Hover off means to move mouse cursor off an element.


## Task bar functionality
|                                       |Action           |Favourites (FV)                                           | Search (FV) | Favourites (CV) | Search (CV)  |
|---                                    |---              |---                                                       | --- | --- | --- |
| Close Button                          | Hover in        | Close button is highlighted                              | "" | "" | "" |
|                                       | Hover out       | Close button highlight removed                           | "" | "" | "" |
|                                       | Left click      | Application Closes                                       | "" | "" | "" |
| Minimize Button                       | Hover in        | Minimize button is highlighted                           | "" | "" | "" |
|                                       | Hover out       | Minimize button highlight removed                        | "" | "" | "" |
|                                       | Left click      | Application Minimizes                                    | "" | "" | "" |
| Maximize Button                       | Hover in        | Maximize button is highlighted                           | "" | "" | "" |
|                                       | Hover out       | Maximize button highlight removed                        | "" | "" | "" |
|                                       | Left click      | Application maximizes                                    | "" | "" | "" |
| History Button (No history)           | Observe         | Button should not be present                             | "" | "" | "" |
| History Button (unviewed history)     | Observe         | Button should be present highlighted                     | "" | "" | "" |
|                                       | Hover in        | History button is highlighted                            | "" | "" | "" |
|                                       | Hover out       | History button is highlighted                            | "" | "" | "" |
|                                       | Left Click      | List of history is displayed to user, most recent first. | "" | "" | "" |
|                                       | Exiting history | Button should lose highlight.                            | "" | "" | "" |
| History Button (viewed history)       | Observe         | Button should be present and not highlighted             | "" | "" | "" |
|                                       | hover in        | History button is highlighted                            | "" | "" | "" |
|                                       | hover out       | History button highlight is removed                      | "" | "" | "" |
|                                       | Left Click      | List of history is displayed to user, most recent first. | "" | "" | "" |
|                                       | Exiting history | Button remain unhighlighted.                             | "" | "" | "" |
| Compact View Button                   | Hover in        | CW button is highlighted                                 | "" | N/A | "" |
|                                       | Hover out       | CW button highlight removed                              | "" | N/A | "" |
|                                       | Left click      | Changes view to CV                                       | "" | N/A | "" |
| Full View Button                      | Hover in        | N/A                                                      | "" | FW button is highlighted | "" |
|                                       | Hover out       | N/A                                                      | "" | FW button highlight is removed | "" |
|                                       | Left Click      | N/A                                                      | "" | Changes view to FV | "" |


### Favourites
|Action      |Favourites (FV)                          | Search (FV)                             | Favourites (CV)                      | Search (CV)  |
|---|---|---|---|---|
| Before First favourite is added | Should contain no stocks and display the text "You have no favourites to display. Use the search tab to add new stocks to the list" | Should display nothing if the search field is empty | Should contain no stocks and display the text "You have no favourites to display. Use the search tab to add new stocks to the list" | Should display nothing if the search field is empty |
| Add *first* favourite | The favourite should be displayed in favourites list, the stock should be automatically selected and the chart and navigation bar for it opened. | The newly added favourite should be displayed in favourites list at the bottom if search field is empty | The newly added favourite should be displayed in favourites list | The newly added favourite should be displayed in favourites list at the bottom if search field is empty |
| Add *another* favourite | The newly added favourite should be displayed in favourites list at the bottom | The newly added favourite should be displayed in favourites list at the bottom if search field is empty | The newly added favourite should be displayed in favourites list at the bottom | The newly added favourite should be displayed in favourites list at the bottom if search field is empty |
| Left click on a favourite stock star symbol | Should display a confirmation dialog asking the user to confirm they wish to remove the stock | The stock should be unfavourited and should not be displayed in the favourites list | Should display a confirmation dialog asking the user to confirm they wish to remove the stock | The stock should be unfavourited and should not be displayed in the favourites list |
| Left click on confirm button when removing stock | The stock should be unfavourited and should not be displayed in the favourites list | N/A | The stock should be unfavourited and should not be displayed in the favourites list |  N/A |
| Left click anywhere on page other than confirm button when removing stock | The stock should not be unfavourited and should still be displayed in the favourites list | N/A |  The stock should not be unfavourited and should still be displayed in the favourites list  | N/A|
| Hover on a favourite stock | Should change the background colour of the hovered favourite to dark grey | "" | "" | "" |
| Hover off a favourite stock | Should change the background colour of the hovered out favourite back to light grey | "" | "" | "" |
| Hover on a favourite stock with long list of favourites | Should change the background colour of the hovered favourite to dark grey. The favourite stock labels should shift right allowing a scroll bar to appear without colliding with the text. Scrolling up/down the list should allow navigating favourites list. | "" |  Should change the background colour of the hovered favourite to dark grey. Scroll bar should appear to allow scrolling up/down the list. | "" |
| Hover off a favourite stock with long list of favourites | Should change the background colour of the hovered out favourite back to light grey, the scroll bar should disappear. The text labels should return to their default location | "" |  Should change the background colour of the hovered out favourite back to light grey, the scroll bar should disappear. | "" |
| Left click a favourite stock | Favourite should become "selected". Dark grey background should remain even after hover out. Chart and Navi bar should be displayed of the selected favourite. | "" | Stock should not be selected | "" |
| Double left click a favourite stock | Favourite should become "selected". Dark grey background should remain even after hover out. Chart and Navi bar should be displayed of the selected favourite. | "" | Full view should be opened. The clicked favourite should become "selected". Dark grey background should remain even after hover out. Chart and Navi bar should be displayed of the selected favourite. | Stock should not be selected |
| Hover on another favourite whilst one is selected |  Selected favourite should maintain its dark grey state. Hovered favourite should also be displayed with dark grey background. |  "" | Selected stock should not be dark grey in compact view | "" |
| Hover off another favourite whilst one is selected | Should maintain the dark background on selected favourite. Should change the background colour of the hovered out favourite back to light grey. | "" | N/A | "" |
| Reposition favourites by holding down left mouse button and dragging | Should move to its new position in the list. | Drag to reposition should not work in search tab | Should move to its new position in the list. | Drag to reposition should not work in search tab |
| Position refreshed | New positions should be immediately visible |  "" | "" | "" |
| Maintain position  | New positions should be retained if window is closed and reopened | "" | "" | "" |
| Drag a favourite out and drop else where on desktop | Favourite is removed from original window and new full window opens with favourite | "" | Favourite is removed from original window and new collapsed window opens with the favourite | "" |
| Drag a favourite out and drop on to another windows favourites | Favourite is removed from original window and moved to the other window | "" | Favourite is removed from original window and moved to the other window | "" |
| Drag the last favourite out and keep mouse down | Window should fade out whilst mouse is moving and reappear if mouse is still for a short while | "" | Window should fade out whilst mouse is moving and reappear if mouse is still for a short while | "" |
| Drag the last favourite out and drop else where on desktop | Window should move to drop location | "" | Window should move to drop location | "" |
| Drag the last favourite out and drop on to another windows favourites | Favourite should move to other window and original should stay closed and not appear in closed window list  | "" | Favourite should move to other window and original should stay closed and not appear in closed window list | "" |

### Transition between Favourites FV and Search FV
| Element | Action |Result |
|---|---|---|
| Search Tab | From the favourites FV, left click the search tab | favourites tab should hide and search tab become visible. |
| Favourites Tab | From the Search FV, left click favourites tab | Search tab should hide and favourites become visible|

### Searching
| Action |Result |
|---|---|---|
| View empty search field | Should contain text "Enter stock name or symbol" |
| Enter "A" character into search field | Should remove the "Enter stock name or symbol" text and replace with the entered search term. The search results field should display "loading search results". Search results which match criteria should be displayed|
| Entering "A" character into search field and hovering on search results | A scroll bar should become visible down the left side of the search results to allow scrolling down the long list. Dragging it should scroll down the list.  The stock hovered over should receive dark grey highlighting. |
| Entering "complicated" into search field | No search results should be found. The search results box should display "Oops! looks like no matches were found."|
| Entering "two" into search field and hovering on results | Should display less results than are needed for a scroll bar to appear on hover. The stock hovered over should receive dark grey highlighting.|
| Entering a search query, closing the search tab and then reopening it| The previous search results should remain on the screen. Long search result lists will be displayed from the first element (not to where you scrolled in the list)|
