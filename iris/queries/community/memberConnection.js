// @flow
import type { DBCommunity } from 'shared/types';
import { GraphQLContext } from '../../';
import { encode, decode } from '../../utils/base64';
const { getMembersInCommunity } = require('../../models/usersCommunities');

export default (
  { id }: DBCommunity,
  { first = 10, after }: PaginationOptions,
  { loaders }: GraphQLContext
) => {
  const cursor = decode(after);
  // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
  const lastDigits = cursor.match(/-(\d+)$/);
  const lastUserIndex =
    lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);

  // $FlowFixMe
  return getMembersInCommunity(id, { first, after: lastUserIndex })
    .then(users => loaders.user.loadMany(users))
    .then(result => ({
      pageInfo: {
        hasNextPage: result && result.length >= first,
      },
      edges: result.filter(Boolean).map((user, index) => ({
        cursor: encode(`${user.id}-${lastUserIndex + index + 1}`),
        node: user,
      })),
    }));
};
