import Titlebar from './components/titlebar/Titlebar';
import ScrollWrapperY from './components/ScrollWrapperY/ScrollWrapperY';
import { Spinner, LargeSpinner } from './components/spinner/Spinner';
import useLocalStorage from './custom-hooks/LocalStorageHook';

import './styles/button-icon.css';
import './styles/icon.css';
import './styles/font.css';
import './styles/scrollbar.css';
import './index.css';

export default {
  Titlebar,
  ScrollWrapperY,
  // useLocalStorageHook should be moved to stockflux-core
  useLocalStorage,
  Spinner,
  LargeSpinner
};
