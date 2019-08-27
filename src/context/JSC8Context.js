import React, { useState } from "react";
import Fabric from 'jsc8';

const defaultState = {
    isSignedIn: false,
    fabric: null
}

function getRandomInt() {
    return Math.floor(Math.random() * Math.floor(99999));
}

const POLLS_COLLECTION_NAME = "polls";

const FabricContext = React.createContext(defaultState);

class FabricProvider extends React.Component {

    state = {
        isSignedIn: false,
        fabric: null,
        config: ""
    }

    componentWillUnmount() {
        const { fabric } = this.state;
        fabric && fabric.close();
    }

    updateFabric = async (config, tenant, user, password, geoFabric) => {
        const fabricHandler = new Fabric(config);
        await fabricHandler.login(tenant, user, password);
        fabricHandler.useTenant(tenant);
        fabricHandler.useFabric(geoFabric);
        this.setState({ fabric: fabricHandler, isSignedIn: true, config });
    }

    updateCollectionData = (obj) => {
        const { fabric } = this.state;
        const collection = fabric.collection(POLLS_COLLECTION_NAME);
        return collection.save(obj);
    }

    establishLiveConnection = (onmessage) => {
        const { fabric, config } = this.state;
        const dcName = config.split("https://")[1];
        const collection = fabric.collection(POLLS_COLLECTION_NAME);
        collection.onChange({
            onopen: () => console.log(`Connection opened for ${POLLS_COLLECTION_NAME}`),
            onmessage,
            onclose: () => console.log(`Connection closed for ${POLLS_COLLECTION_NAME}`)
        }, dcName, `${POLLS_COLLECTION_NAME}-${getRandomInt()}`);
    }

    onSubmitVote = async (pollName, selectedPollId) => {

        const { fabric } = this.state;
        const path = window.location.pathname;
        const documentKey = path.split("/poll/")[1];

        const voteArr = await this.getPollData(pollName, documentKey);

        const voteObj = voteArr.find(vote => vote.id === selectedPollId);
        voteObj.votes += 1;

        const pollObj = { [pollName]: [...voteArr] };

        const updatePollQuery = `UPDATE "${documentKey}" WITH ${JSON.stringify(pollObj)} in ${POLLS_COLLECTION_NAME}`;
        return fabric.query(updatePollQuery);
    }

    getPollData = async (pollName, documentKey) => {
        const { fabric } = this.state;
        const query = `FOR x in ${POLLS_COLLECTION_NAME} FILTER x._key=="${documentKey}" return x`;
        const cursor = await fabric.query(query);
        const results = await cursor.all();
        return results[0][pollName];
    }

    render() {
        const { isSignedIn, fabric } = this.state;
        const { children } = this.props;
        return (
            <FabricContext.Provider value={{
                isSignedIn,
                fabric,
                updateFabric: this.updateFabric,
                updateCollectionData: this.updateCollectionData,
                onSubmitVote: this.onSubmitVote,
                getPollData: this.getPollData,
                establishLiveConnection: this.establishLiveConnection
            }}>
                {children}
            </FabricContext.Provider>
        )
    }
}

export default FabricContext;
export { FabricProvider };