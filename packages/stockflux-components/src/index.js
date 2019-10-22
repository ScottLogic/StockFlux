import Titlebar from './components/Titlebar/Titlebar';
import ScrollWrapperY from './components/scroll-wrapper-y/ScrollWrapperY';
import { Spinner, LargeSpinner } from './components/spinner/Spinner';
import Watchlist from './components/buttons/round-buttons/app-shortcuts/Watchlist';
import Chart from './components/buttons/round-buttons/app-shortcuts/Chart';
import Round from './components/buttons/round-button/RoundButton';
import Close from './components/buttons/round-buttons/Close';
import News from './components/buttons/round-buttons/app-shortcuts/News';
import ConfirmationWindow from './components/popups/ConfirmationWindow';
import PopupWindow from './components/popups/PopupWindow';

import './styles/button-icon.css';
import './styles/icon.css';
import './styles/font.css';
import './styles/scrollbar.css';
import './index.css';

export default {
  Titlebar,
  ScrollWrapperY,
  Spinner,
  LargeSpinner,
  Buttons: { Round, Close },
  Shortcuts: { Watchlist, Chart, News },
  Popups: { PopupWindow, ConfirmationWindow }
};
