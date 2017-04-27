// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
import User from './user';
import Frequency from './frequency';
import Community from './community';

const ProfilePure = (props: Object): React$Element<any> => {
  const { type } = props;
  switch (type) {
    case 'user': {
      return <User {...props} />;
    }
    case 'frequency': {
      return <Frequency {...props} />;
    }
    case 'community': {
      return <Community {...props} />;
    }
    default: {
      return <User {...props} />;
    }
  }
};

type ProfileProps = {
  data: {
    title: string,
    subtitle: string,
    photoURL?: string,
    id?: string,
  },
  meta?: Array<any>,
  size?: 'mini' | 'small' | 'medium' | 'large' | 'full',
};

export const Profile = compose(pure)(ProfilePure);
export const UserProfile = (props: ProfileProps) => (
  <Profile type="user" {...props} />
);
export const FrequencyProfile = (props: ProfileProps) => (
  <Profile type="frequency" {...props} />
);
export const CommunityProfile = (props: ProfileProps) => (
  <Profile type="community" {...props} />
);
