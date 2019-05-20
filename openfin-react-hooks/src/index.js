import useDockedHook from "./useDocked";
import useMaximizedHook from "./useMaximized";
import useSubscription from './InterApplicationBus/useInterApplicationBusSubscription';
import usePublish from './InterApplicationBus/useInterApplicationBusPublish';
import useCurrentWindowState, { ScreenEdge } from './Window/useCurrentWindowState';

export const useDocked = useDockedHook;
export const useMaximized = useMaximizedHook;

export const InterApplicationBusHooks = {
  useSubscription,
  usePublish
};

export const WindowHooks = {
  useCurrentWindowState
};

export const Constants = {
  ScreenEdge
};

export default {
  useDocked,
  useMaximized
};
