import * as Layouts from 'openfin-layouts';

const uuid = fin.desktop.Application.getCurrent().uuid;

function LayoutsService(store) {
    const layoutsStore = LayoutsStore();

    fin.desktop.InterApplicationBus.subscribe(uuid, 'join-snap-group', updateGroupsAndNotify);
    fin.desktop.InterApplicationBus.subscribe(uuid, 'leave-snap-group', updateGroupsAndNotify);

    store.subscribe(updateGroupsAndNotify);

    async function updateGroupsAndNotify() {
        const { joined, left } = await layoutsStore.updateGroups();
        joined.forEach(windowName => fin.desktop.InterApplicationBus.send(uuid, 'joined-snap-group', { windowName }));
        left.forEach(windowName => fin.desktop.InterApplicationBus.send(uuid, 'left-snap-group', { windowName }));
    }
}

function LayoutsStore() {
    let sameGroup = {};

    async function updateGroups() {
        const childWindows = await getChildWindows();
        return resetGroups(childWindows)
    }

    function resetGroups(childWindows) {
        const previousCounts = sameGroupCounts();

        sameGroup = childWindows.reduce(
            (group, childWindow) => {
                if (group[childWindow.name] === undefined) {
                    const windowGroup = childWindow.windowGroup || [];
                    group[childWindow.name] = [childWindow.name].concat(windowGroup.map(win => win.name));
                    windowGroup.forEach(win => (group[win.name] = group[childWindow.name]));
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
            (counts, key) => (counts[key] = sameGroup[key].length) && counts,
            {}
        );
    }

    function diff(previousCounts, nextCounts) {
        return {
            joined: Object.keys(nextCounts).filter(key => nextCounts[key] !== previousCounts[key] && nextCounts[key] > 1),
            left: Object.keys(nextCounts).filter(key => nextCounts[key] !== previousCounts[key] && nextCounts[key] === 1)
        };
    }

    return {
        updateGroups
    };
}

async function getChildWindows() {
    const layout = await Layouts.generateLayout();
    const app = layout.apps.find(app => app.uuid === uuid);
    return app.childWindows;
}

export default LayoutsService;
