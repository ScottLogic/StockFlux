import useDockWindow from "./Window/useDockWindow";
import useDockedHook from "./useDocked";
import useMaximizedHook from "./useMaximized";
import useSubscription from './InterApplicationBus/useInterApplicationBusSubscription';
import usePublish from './InterApplicationBus/useInterApplicationBusPublish';
import useAppSearch from './AppDirectory/useAppSearch';
import useCurrentWindowOptions from './Window/useCurrentWindowOptions';
import useCurrentWindowState from './Window/useCurrentWindowState';
import usePopoutWindow from './Window/usePopoutWindow';

import { ScreenEdge } from './constants';

export const useDocked = useDockedHook;
export const useMaximized = useMaximizedHook;

export const InterApplicationBusHooks = {
  useSubscription,
  usePublish
};

export const AppDirectoryHooks = {
  useAppSearch
};

export const WindowHooks = {
  useCurrentWindowOptions,
  useCurrentWindowState,
  useDockWindow,
  usePopoutWindow
};

export const Constants = {
  ScreenEdge
};

export default {
  useDocked,
  useMaximized
};
