import React, { Component } from 'react';
import Poll from "../components/Poll/index";
import Layout from "../components/layout";

class PollContainer extends Component {

    state = {
        title: '',
        loading: false,
        selection: "",
        hasVoted: false,
        options: []
    };

    componentDidMount() {
        const { title, options } = this.props.location.state;
        this.setState({ title, options });
    }

    onVote = async (onSubmitVote, getPollData, establishLiveConnection) => {
        const { location: { state: { title, documentKey } } } = this.props;
        const { selection } = this.state;
        this.setState({ loading: true }, () => {
            onSubmitVote(title, selection)
                .then(async () => {
                    const pollData = await getPollData(title, documentKey);
                    this.setState({ loading: false, hasVoted: true, options: Object.values(pollData) }, () => {
                        // open socket connections for live updates
                        const onmessage = msg => {
                            const { payload } = JSON.parse(msg);
                            const decoded = JSON.parse(atob(payload));
                            this.setState({ options: decoded[title] });
                        }
                        establishLiveConnection(onmessage);
                    });
                })
                .catch(err => console.log(err))
        });

    }

    onSelectOption(id) {
        this.setState({ selection: id });
    }


    render() {
        return (
            <Layout>
                {
                    (fabricCtx) => (
                        <Poll {...this.state}
                            onVote={() => { this.onVote(fabricCtx.onSubmitVote, fabricCtx.getPollData, fabricCtx.establishLiveConnection) }}
                            onSelectOption={(id) => { this.onSelectOption(id, fabricCtx.fabric) }}
                        />
                    )
                }
            </Layout>
        );
    }
}

export default PollContainer;