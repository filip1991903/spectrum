// @flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withRouter } from 'react-router';

import {
  editCommunityMutation,
  deleteCommunityMutation,
} from '../../api/community';
import { openModal } from '../../actions/modals';
import { addToastWithTimeout } from '../../actions/toasts';

import { Button, TextButton, IconButton } from '../buttons';
import {
  Input,
  UnderlineInput,
  TextArea,
  PhotoInput,
  CoverInput,
} from '../formElements';
import {
  StyledCard,
  Form,
  FormTitle,
  Description,
  Actions,
  TertiaryActionContainer,
  ImageInputWrapper,
} from './style';

class CommunityWithData extends Component {
  state: {
    name: string,
    slug: string,
    description: string,
    communityId: string,
    website: string,
    image: string,
    coverPhoto: string,
    file: ?Object,
    coverFile: ?Object,
    communityData: Object,
  };
  constructor(props) {
    super(props);

    const { community } = this.props;
    this.state = {
      name: community.name,
      slug: community.slug,
      description: community.description,
      communityId: community.id,
      website: community.website,
      image: community.profilePhoto,
      coverPhoto: community.coverPhoto,
      file: null,
      coverFile: null,
      communityData: community,
    };
  }

  changeName = e => {
    const name = e.target.value;
    this.setState({
      name,
    });
  };

  changeDescription = e => {
    const description = e.target.value;
    this.setState({
      description,
    });
  };

  changeSlug = e => {
    const slug = e.target.value;
    this.setState({
      slug,
    });
  };

  changeWebsite = e => {
    const website = e.target.value;
    this.setState({
      website,
    });
  };

  setCommunityPhoto = e => {
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        image: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  setCommunityCover = e => {
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        coverFile: file,
        coverPhoto: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  save = e => {
    e.preventDefault();
    const {
      name,
      description,
      website,
      file,
      coverFile,
      communityId,
    } = this.state;
    const input = {
      name,
      description,
      website,
      file,
      coverFile,
      communityId,
    };
    this.props
      .editCommunity(input)
      .then(({ data: { editCommunity } }) => {
        const community = editCommunity;

        // community was returned
        if (community !== undefined) {
          this.props.dispatch(
            addToastWithTimeout('success', 'Community saved!')
          );
          this.props.history.push(`/${this.props.community.slug}`);
        }
      })
      .catch(err => {
        this.props.dispatch(
          addToastWithTimeout(
            'error',
            `Something went wrong and we weren't able to save these changes. ${err}`
          )
        );
      });
  };

  cancelForm = e => {
    e.preventDefault();
    return (window.location.href = `/${this.props.community.slug}`);
  };

  triggerDeleteCommunity = (e, communityId) => {
    e.preventDefault();
    const { name, communityData } = this.state;
    const message = (
      <div>
        <p>Are you sure you want to delete your community, <b>{name}</b>?</p>
        {' '}
        <p>
          <b>{communityData.metaData.members} members</b>
          {' '}
          will be removed from the community and the
          {' '}
          <b>{communityData.metaData.channels} channels</b>
          {' '}
          you've created will be deleted.
        </p>
        <p>
          All threads, messages, reactions, and media shared in your community will be deleted.
        </p>
        <p>This cannot be undone.</p>
      </div>
    );

    return this.props.dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: communityId,
        entity: 'community',
        message,
      })
    );
  };

  render() {
    const { name, slug, description, image, coverPhoto, website } = this.state;
    const { community } = this.props;

    if (!community) {
      return (
        <StyledCard>
          <FormTitle>This community doesn't exist yet.</FormTitle>
          <Description>Want to make it?</Description>
          <Actions>
            <Button>Create</Button>
          </Actions>
        </StyledCard>
      );
    }

    return (
      <StyledCard>
        <FormTitle>Community Settings</FormTitle>
        <Form>
          <ImageInputWrapper>
            <CoverInput
              onChange={this.setCommunityCover}
              defaultValue={coverPhoto}
            />

            <PhotoInput
              onChange={this.setCommunityPhoto}
              defaultValue={image}
            />
          </ImageInputWrapper>

          <Input defaultValue={name} onChange={this.changeName}>Name</Input>
          <UnderlineInput defaultValue={slug} disabled>
            sp.chat/
          </UnderlineInput>
          <TextArea
            defaultValue={description}
            onChange={this.changeDescription}
          >
            Description
          </TextArea>

          <Input
            defaultValue={website}
            onChange={this.changeWebsite}
            autoFocus={true}
          >
            Optional: Add your community's website
          </Input>

          <Actions>
            <TertiaryActionContainer>
              <IconButton
                glyph="delete"
                tipText={`Delete ${name}`}
                tipLocation="top-right"
                color="text.placeholder"
                hoverColor={'warn.alt'}
                onClick={e => this.triggerDeleteCommunity(e, community.id)}
              />
            </TertiaryActionContainer>
            <TextButton hoverColor={'warn.alt'} onClick={this.cancelForm}>
              Cancel
            </TextButton>
            <Button onClick={this.save}>Save</Button>
          </Actions>
        </Form>
      </StyledCard>
    );
  }
}

const Community = compose(
  deleteCommunityMutation,
  editCommunityMutation,
  withRouter,
  pure
)(CommunityWithData);
export default connect()(Community);
