import React, { Component } from 'react';
import FabricContext from "../context/JSC8Context";
import Poll from "../components/Poll/index";
import Layout from "../components/layout";

class PollContainer extends Component {

    state = {
        title: '',
        loading: false,
        selection: null,
        hasVoted: false,
        votingData: null
    };

    onVote(data, onSubmitVote) {
        onSubmitVote(data)
            .then()
            .catch()
    }

    onSelectOption(id) {
        this.setState({ selection: id }, () => {

        });
    }


    render() {
        const { loading, hasVoted } = this.state;
        return (
            <FabricContext.Consumer>
                {
                    fabricCtx => {
                        return (
                            <Layout>
                                {
                                    () => <Poll {...this.state} {...this.props.location.state} onVote={() => { this.onVote(data, fabricCtx.onSubmitVote) }} onSelectOption={(id) => { this.onSelectOption(id, fabricCtx.fabric) }} />
                                }
                            </Layout>
                        )
                    }
                }
            </FabricContext.Consumer>
        );
    }
}

export default PollContainer;