import * as fdc3 from 'openfin-fdc3';

export default async () =>
  fdc3.raiseIntent('WatchlistView', { type: 'security' });
