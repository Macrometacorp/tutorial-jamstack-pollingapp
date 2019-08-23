import React, { Component } from 'react';
import FabricContext from "../context/JSC8Context";
import Poll from "../components/Poll/index";
import Layout from "../components/layout";

class PollContainer extends Component {

    state = {
        title: '',
        loading: false,
        selection: "",
        hasVoted: false,
    };

    componentDidMount() {
        const { collection, title, options } = this.props.location.state;
        this.setState({ collection, title, options });
    }

    onVote = async (onSubmitVote, getPollData) => {
        const { location: { state: { title } } } = this.props;
        const { selection } = this.state;
        this.setState({ loading: true }, () => {
            onSubmitVote(title, selection)
                .then(async () => {
                    const pollData = await getPollData(title);
                    this.setState({ loading: false, hasVoted: true, options: pollData });
                })
                .catch(err => console.log(err))
        });

    }

    onSelectOption(id) {
        this.setState({ selection: id });
    }


    render() {
        return (
            <FabricContext.Consumer>
                {
                    fabricCtx => {
                        return (
                            <Layout>
                                {
                                    () => <Poll {...this.state} onVote={() => { this.onVote(fabricCtx.onSubmitVote, fabricCtx.getPollData) }} onSelectOption={(id) => { this.onSelectOption(id, fabricCtx.fabric) }} />
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