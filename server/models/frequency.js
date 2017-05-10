// @flow
/**
 * Storing and retrieving frequencies
 */
const { db } = require('./db');
import { UserError } from 'graphql-errors';

const getFrequenciesByCommunity = (community: string) => {
  return db.table('frequencies').filter({ community }).run();
};

const getFrequenciesByUser = (uid: string) => {
  return db
    .table('frequencies')
    .filter(frequency => frequency('subscribers').contains(uid))
    .run();
};

const getFrequencyBySlug = (slug: string, community: string) => {
  return db
    .table('frequencies')
    .eqJoin('community', db.table('communities'))
    .filter({
      left: {
        slug: slug,
      },
      right: {
        slug: community,
      },
    })
    .run()
    .then(result => result && result[0].left);
};

type GetFrequencyByIdArgs = {
  id: string,
};

type GetFrequencyBySlugArgs = {
  slug: string,
  community: string,
};

export type GetFrequencyArgs = GetFrequencyByIdArgs | GetFrequencyBySlugArgs;

const getFrequencies = (ids: Array<string>) => {
  return db.table('frequencies').getAll(...ids).run();
};

const getFrequencyMetaData = (id: string) => {
  const getStoryCount = db
    .table('stories')
    .filter({ frequency: id })
    .count()
    .run();
  const getSubscriberCount = db
    .table('frequencies')
    .get(id)
    .getField('subscribers')
    .count()
    .run();

  return Promise.all([getStoryCount, getSubscriberCount]);
};

export type CreateFrequencyArguments = {
  input: {
    community: string,
    name: string,
    description: string,
    slug: string,
  },
};

const createFrequency = (
  { input: { community, name, slug, description } }: CreateFrequencyArguments,
  creatorId: string
) => {
  return db
    .table('frequencies')
    .insert(
      {
        name,
        description,
        slug,
        createdAt: new Date(),
        modifiedAt: new Date(),
        community: community,
        subscribers: [creatorId],
        owners: [creatorId],
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

const deleteFrequency = id => {
  return db
    .table('frequencies')
    .get(id)
    .delete({ returnChanges: true })
    .run()
    .then(({ deleted, changes }) => {
      if (deleted > 0) {
        // frequency was deleted, return the object to clear the client store
        return changes[0].old_val.id;
      }
    });
};

const getTopFrequencies = (amount: number) => {
  return db
    .table('frequencies')
    .orderBy(db.desc('subscribers'))
    .limit(amount)
    .run();
};

const getFrequencySubscriberCount = (id: string) => {
  return db.table('frequencies').get(id)('subscribers').count().run();
};

module.exports = {
  getFrequencyBySlug,
  getFrequencyMetaData,
  getFrequenciesByUser,
  getFrequenciesByCommunity,
  createFrequency,
  deleteFrequency,
  getTopFrequencies,
  getFrequencySubscriberCount,
  getFrequencies,
};
