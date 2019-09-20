import Titlebar from './components/Titlebar/Titlebar';
import ScrollWrapperY from './components/scroll-wrapper-y/ScrollWrapperY';
import { Spinner, LargeSpinner } from './components/spinner/Spinner';
import Watchlist from './components/app-shortcuts/Watchlist';
import Chart from './components/app-shortcuts/Chart';
import RoundButton from './components/round-button/RoundButton';
import News from './components/app-shortcuts/News';

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
  RoundButton,
  Shortcuts: { Watchlist, Chart, News }
};
