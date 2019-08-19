import React, { Component } from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import { arrayMove } from 'react-sortable-hoc';
import shortId from 'short-id';
import Layout from '../components/layout';

import { Button } from '../styledComponents/theme';
import { Heading2 } from '../styledComponents/typography';
import NewPoll from '../components/NewPoll/index';

const CreateButton = styled(Button)`
  background-image: linear-gradient(19deg, #21d4fd 0%, #b721ff 100%);
  margin-left: 20px;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TitleContainer = styled.div`
  display: inline-flex;
  width: 350px;
  flex-direction: column;
  margin-bottom: 30px;
`;

const TitleLabel = styled.label`
  font-weight: bold;
`;

const TitleInput = styled.input`
  color: black;
  font-size: 18px;
`;


class NewPollPageComponent extends Component {
  state = {
    title: '',
    options: [],
    loading: false,
  };
  // to keep track of what item is being edited
  editing = null;

  handleKeydown = e => {
    if (e.which === 27) this.handleToggleEdit(this.editing);
    if (e.which === 13) this.handleAddItem();
  };

  handleToggleEdit = id => {
    this.setState(prevState => {
      const options = prevState.options
        .filter(({ text }) => text)
        .map(option => {
          if (option.id === id) {
            if (!option.editing) {
              this.editing = id;
            } else {
              this.editing = null;
            }

            return {
              ...option,
              editing: !option.editing,
            };
          }

          return {
            ...option,
            editing: false,
          };
        });

      return {
        ...prevState,
        options,
      };
    });
  };

  handleTextChange = (e, id) => {
    const options = this.state.options.map(option => {
      if (option.id === id) {
        return {
          ...option,
          text: e.target.value,
        };
      }

      return option;
    });

    this.setState({
      ...this.state,
      options,
    });
  };

  handleSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      ...this.state,
      options: arrayMove(this.state.options, oldIndex, newIndex),
    });
  };

  handleAddItem = () => {
    // if the user spams add w/o writing any text the items w/o any text get removed
    const options = this.state.options
      // filter out any falsy values from the list
      .filter(Boolean)
      .filter(({ text }) => text)
      .map(option => ({
        ...option,
        editing: false,
      }));
    const id = shortId.generate();
    this.editing = id;

    this.setState({
      ...this.state,
      options: [
        ...options,
        {
          id,
          text: '',
          editing: true,
        },
      ],
    });
  };

  handleDelete = id => {
    const options = this.state.options.filter(option => option.id !== id);

    this.setState({
      ...this.state,
      options,
    });
  };

  handleTitleChange = e => {
    const { value } = e.target;

    this.setState({
      title: value,
    });
  };

  render() {
    const { options, title, loading } = this.state;

    const optionsWithText = options.filter(({ text }) => !!text.trim());
    const disableCreate = !title || optionsWithText.length < 2 || loading;
    console.log({
      title,
      optionsWithText,
      loading,
      disableCreate
    });

    return (
      <div>
        <Heading2>Create a new Poll</Heading2>
        <TitleContainer>
          <TitleLabel htmlFor="newPollTitle">Title</TitleLabel>
          <TitleInput
            id="newPollTitle"
            value={title}
            onChange={this.handleTitleChange}
          />
        </TitleContainer>
        <NewPoll
          options={options}
          onToggleEdit={this.handleToggleEdit}
          onTextChange={this.handleTextChange}
          onKeyDown={this.handleKeydown}
          onSortEnd={this.handleSortEnd}
          onDelete={this.handleDelete}
        />
        <ActionContainer>
          <Button
            disabled={disableCreate}
            onClick={!disableCreate && this.handleCreate}>
            {loading ? 'Creating...' : 'Create'}
          </Button>

          <CreateButton
            disabled={loading}
            onClick={!loading && this.handleAddItem}>
            Add
          </CreateButton>
        </ActionContainer>
      </div>
    );
  }
}

const NewPollPage = () => {
  const data = useStaticQuery(graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`);

  return (
    <Layout data={data}>
      {() => (
        <NewPollPageComponent />
      )}
    </Layout>
  )
};

export default NewPollPage;