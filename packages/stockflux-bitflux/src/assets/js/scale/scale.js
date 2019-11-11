import skipWeekends from './discontinuity/skipWeekends';
import tickValues from './dateTime/tickValues';
import responsiveTickCount from './responsiveTickCount';

export default {
  responsiveTickCount: responsiveTickCount,
  discontinuity: {
    skipWeekends: skipWeekends
  },
  dateTime: {
    tickValues: tickValues
  }
};
