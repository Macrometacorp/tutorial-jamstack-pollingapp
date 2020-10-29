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

    updateFabric = async (config, email, password, geoFabric) => {
        const fabricHandler = new Fabric(config);
        await fabricHandler.login(email, password);
        fabricHandler.useFabric(geoFabric);
        this.setState({ fabric: fabricHandler, isSignedIn: true, config });
    }

    updateCollectionData = (obj) => {
        const { fabric } = this.state;
        const collection = fabric.collection(POLLS_COLLECTION_NAME);
        return collection.save(obj);
    }

    establishLiveConnection = async (onmessage) => {
        const { fabric, config } = this.state;
        const dcName = config.split("https://")[1];
        const collection = fabric.collection(POLLS_COLLECTION_NAME);
        const ws = await collection.onChange(dcName, `${POLLS_COLLECTION_NAME}-${getRandomInt()}`);

        ws.on("open", () => console.log(`Connection opened for ${POLLS_COLLECTION_NAME}`));
        ws.on("message", onmessage);
        ws.on("error", e => console.log(`Connection errored for ${POLLS_COLLECTION_NAME}: ${e}`));
        ws.on("close", () => console.log(`Connection closed for ${POLLS_COLLECTION_NAME}`));
    }

    getDocumentKey = () => window.location.pathname.split("/poll/")[1];

    onSubmitVote = async (selectedPollId) => {

        const { fabric } = this.state;
        const documentKey = this.getDocumentKey();

        const voteArr = await this.getPollData();

        const voteObj = voteArr.find(vote => vote.id === selectedPollId);
        voteObj.votes += 1;

        const pollObj = { polls: [...voteArr] };

        const updatePollQuery = `UPDATE "${documentKey}" WITH ${JSON.stringify(pollObj)} in ${POLLS_COLLECTION_NAME}`;
        return fabric.query(updatePollQuery);
    }

    getPollData = async (allData) => {
        const documentKey = this.getDocumentKey();
        const { fabric } = this.state;
        const query = `FOR x in ${POLLS_COLLECTION_NAME} FILTER x._key=="${documentKey}" return x`;
        const cursor = await fabric.query(query);
        const results = await cursor.all();
        return allData ? results[0] : results[0].polls;
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