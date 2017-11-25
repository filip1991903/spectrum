import React, { Component } from 'react';
import { track } from '../../helpers/events';
import { storeItem, getItemFromStorage } from '../../helpers/localStorage';
import {
  Overview,
  Centralized,
  CommunitySearch,
  Free,
  Standard,
  Pro,
  PageFooter,
} from './view';
import { Wrapper } from './style';

class Pricing extends Component {
  state: {
    preferredSigninMethod: string,
  };

  constructor() {
    super();

    const preferredSigninMethod = getItemFromStorage('preferred_signin_method');

    this.state = {
      preferredSigninMethod,
    };
  }

  componentDidMount() {
    track('pricing', 'viewed', null);
  }

  trackSignin = (type, method) => {
    track('pricing', 'logged in', type);
    storeItem('preferred_signin_method', method);
  };

  render() {
    return (
      <Wrapper data-e2e-id="pricing-page">
        <Free />
        <Standard />
        <Pro />
        <PageFooter />
      </Wrapper>
    );
  }
}
export default Pricing;
