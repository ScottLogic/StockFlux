import * as Layouts from 'openfin-layouts';

const uuid = fin.desktop.Application.getCurrent().uuid;

export default async function start(store) {

    // TODO: AS layouts
    let startup = true;

    const layoutsStore = LayoutsStore();

    fin.desktop.InterApplicationBus.subscribe(uuid, 'join-snap-group', () => {
        console.log('JOIN-SNAP-GROUP triggered');
        updateGroupsAndNotify();
    });

    fin.desktop.InterApplicationBus.subscribe(uuid, 'leave-snap-group', () => {
        console.log('LEAVE-SNAP-GROUP triggered');
        updateGroupsAndNotify();
    });

    store.subscribe(updateGroupsAndNotify);

    // TODO: AS layouts
    // NOTE: layout is loaded from store, if windows were docked then childWindows should be included in windowGroups.
    const layout = store.getState().layout;
    const afterLayout = await restoreLayout(layout.layout);
    console.log(afterLayout);

    async function updateGroupsAndNotify() {
        // TODO: AS this method is called every time an action has been triggered and the state has changed (including Open and every other action)

        let childWindows = null;

        // If starting up the application then we need to use the store version other get the latest version.
        if (startup) {
            childWindows = store.getState().layout.layout.apps[0].childWindows;
            startup = false;
        } else {
            childWindows = await getChildWindows();
        }

        const { joined, left } = await layoutsStore.updateGroups(childWindows);

        joined.forEach((windowName) => fin.desktop.InterApplicationBus.send(uuid, 'joined-snap-group', { windowName }));
        left.forEach((windowName) => fin.desktop.InterApplicationBus.send(uuid, 'left-snap-group', { windowName }));
    }
}

function LayoutsStore() {
    let sameGroup = {};

    async function updateGroups(childWindows) {
        // TODO : AS disabling this line
        // const childWindows = await getChildWindows();

        // const childWindows = store.getState().layout.layout.apps[0].childWindows;

        return resetGroups(childWindows);
    }

    function resetGroups(childWindows) {
        const previousCounts = sameGroupCounts();

        sameGroup = childWindows.reduce(
            (group, childWindow) => {
                if (group[childWindow.name] === undefined) {
                    const windowGroup = childWindow.windowGroup || [];
                    // eslint-disable-next-line no-param-reassign
                    group[childWindow.name] = [childWindow.name].concat(windowGroup.map((win) => win.name));
                    // eslint-disable-next-line no-param-reassign
                    windowGroup.forEach((win) => (group[win.name] = group[childWindow.name]));
                }
                return group;
            },
            {}
        );

        const nextCounts = sameGroupCounts();
        return diff(previousCounts, nextCounts);
    }

    function sameGroupCounts() {
        return Object.keys(sameGroup || {}).reduce(
            (counts, key) => {
                // eslint-disable-next-line no-param-reassign
                counts[key] = sameGroup[key].length;
                return counts;
            },
            {}
        );
    }

    function diff(previousCounts, nextCounts) {
        const nextCountsKeys = Object.keys(nextCounts);
        return {
            joined: nextCountsKeys.filter((key) => nextCounts[key] !== previousCounts[key] && nextCounts[key] > 1),
            left: nextCountsKeys.filter((key) => nextCounts[key] !== previousCounts[key] && nextCounts[key] === 1)
        };
    }

    return {
        updateGroups
    };
}

async function getChildWindows() {
    const layout = await Layouts.generateLayout();
    const currentApp = layout.apps.find((app) => app.uuid === uuid);
    return currentApp.childWindows;
}

async function restoreLayout(layout) {
    console.log('restoreLayout IN');
    console.log(layout);
    return await Layouts.restoreLayout(layout);
    // console.log('restoreLayout OUT');
}

// TODO: AS this method is taken from the Openfin layouts website Layouts page. Under 'Restoring a Layout' the page 
// seems to imply that child windows need to be managed at individual application level, hence this method. However 
// it looks as though the positionWindow and openChild functions need to be created ourselves.
async function appRestore(layoutApp) {

    console.log('appRestore => IN');
    console.log(layoutApp);

    const ofApp = await fin.Application.getCurrentSync();
    const openWindows = await ofApp.getChildWindows();

    // iterate through the child windows of the layoutApp data
    const opened = layoutApp.childWindows.map(async (win) => {
        // check for existence of the window
        if (!openWindows.some((window) => window.identity.name === win.name)) {

            // create the window if needed
            //const ofWin = await openChild(win.name, win.info.url);

            // use the positioning logic from the Layouts service
            //await positionWindow(ofWin);
        } else {
            // only position if the window exists
            //await positionWindow(win);
        }
    });

    // wait for all windows to open and be positioned before returning
    Promise.all(opened);
    return layoutApp;
}

// TODO: AS this method has been taken from openfin's layouts-service code, I have not yet modified
// it for ours (needs to be based on the ParentService => createChildWindow code). To be done....
async function openChild(name, frame = true, url, bounds) {
    if (bounds) {
        return await fin.Window.create({
            url,
            autoShow: true,
            defaultHeight: bounds.height,
            defaultWidth: bounds.width,
            defaultLeft: bounds.left,
            defaultTop: bounds.top,
            saveWindowState: false,
            frame,
            name
        });
    } else {
        return await fin.Window.create({
            url,
            autoShow: true,
            defaultHeight: 250 + 50,
            defaultWidth: 250 + 50,
            defaultLeft: 320,
            defaultTop: 50,
            saveWindowState: false,
            frame,
            name
        });
    }
}

// TODO: AS AS this method has been taken from openfin's layouts-service code, I have not yet modified
// it for ours. This can probably be simplified and just use the setBounds and certainly remove the ofWin.leaveGroup.

// Positions a window when it is restored.
// Also given to the client to use.
const positionWindow = async (win) => {
    try {
        const ofWin = await fin.Window.wrap(win);
        await ofWin.setBounds(win);
        if (win.isTabbed) {
            return;
        }
        await ofWin.leaveGroup();


        // COMMENTED OUT FOR DEMO
        if (win.state === 'normal') {
            await ofWin.restore();
        } else if (win.state === 'minimized') {
            await ofWin.minimize();
        } else if (win.state === 'maximized') {
            await ofWin.maximize();
        }

        if (win.isShowing) {
            await ofWin.show();
        } else {
            await ofWin.hide();
        }
    } catch (e) {
        console.error('position window error', e);
    }
};

Layouts.onAppRestore(appRestore);

Layouts.onLayoutRestore(() => console.log('ON LAYOUT RESTORE'));
Layouts.onLayoutSave(() => console.log('ON LAYOUT SAVE'));
Layouts.onApplicationSave(() => console.log('ON APPLICATION SAVE'));
Layouts.ready();
