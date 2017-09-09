// @flow
const { db } = require('./db');

export const getActiveThreadsInTimeframe = (
  timeframe: string
): Promise<Array<Object>> => {
  let range;
  switch (timeframe) {
    case 'daily': {
      range = 60 * 60 * 24;
    }
    case 'weekly': {
      range = 60 * 60 * 24 * 7;
    }
    default: {
      range = 60 * 60 * 24 * 7;
    } // default to weekly
  }

  return db
    .table('threads')
    .filter(db.row('lastActive').during(db.now().sub(range), db.now()))
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run();
};
