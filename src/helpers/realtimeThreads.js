import { addActivityIndicator } from '../actions/newActivityIndicator';
import type { Dispatch } from 'redux';

// used to update feed caches with new threads in real time
// takes an array of existing threads in the cache and figures out how to insert the newly updated thread
export default (
  prevThreads: Array,
  updatedThread: Object,
  dispatch: Dispatch<Object>
) => {
  // get an array of thread ids based on the threads already in cache
  const prevThreadIds = prevThreads.map(thread => thread.node.id);

  // determine if the newly updated thread exists in the cache or not
  // if it doesn't exist in cache, it's a new thread! if it does exist in cache, it just means its
  // been updated with a new message
  const hasNewThread = prevThreadIds.indexOf(updatedThread.id) < 0;

  // if the updated thread is new, show the activity indicator in the ui
  if (hasNewThread) {
    dispatch(addActivityIndicator());
  }

  return hasNewThread
    ? [
        {
          node: updatedThread,
          cursor: '__this-is-a-cursor__',
          __typename: 'Thread',
        },
        ...prevThreads,
      ]
    : [
        ...prevThreads.map(thread => {
          if (thread.node.id !== updatedThread.id) return thread;
          return {
            node: updatedThread,
            cursor: '__this-is-a-cursor__',
            __typename: 'Thread',
          };
        }),
      ];
};
