import useDockedHook from "./useDocked";
import useMaximizedHook from "./useMaximized";
import useSubscription from './InterApplicationBus/useInterApplicationBusSubscription';
import usePublish from './InterApplicationBus/useInterApplicationBusPublish';

export const useDocked = useDockedHook;
export const useMaximized = useMaximizedHook;

export const InterApplicationBusHooks = {
  useSubscription,
  usePublish
}

export default {
  useDocked,
  useMaximized
};
