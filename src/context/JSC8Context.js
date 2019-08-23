import React, { useState } from "react";
import Fabric from 'jsc8';
import { graphql, StaticQuery } from "gatsby";

const defaultState = {
    isSignedIn: false,
    fabric: null,
    updateFabric: () => { }
}

const FabricContext = React.createContext(defaultState);

class FabricProvider extends React.Component {

    state = {
        isSignedIn: false,
        fabric: null,
        collection: "",
        documentKey: ""
    }

    updateFabric = async (config, tenant, user, password, geoFabric, collection, documentKey) => {
        const fabricHandler = new Fabric(config);
        await fabricHandler.login(tenant, user, password);
        fabricHandler.useTenant(tenant);
        fabricHandler.useFabric(geoFabric);
        this.setState({ fabric: fabricHandler, isSignedIn: true, collection, documentKey });
    }

    updateCollectionData = (obj) => {
        const { documentKey, collection, fabric } = this.state;
        const query = `UPDATE "${documentKey}" WITH ${JSON.stringify(obj)} IN ${collection}`;
        return fabric.query(query);
    }

    onSubmitVote = async (pollName, pollId) => {

        const { fabric, collection, documentKey } = this.state;

        const voteArr = await this.getPollData(pollName);

        const voteObj = voteArr.find(vote => vote.id === pollId);
        voteObj.votes += 1;

        const pollObj = {
            polls: { [pollName]: { ...voteArr } }
        };

        const updatePollQuery = `UPDATE "${documentKey}" WITH ${JSON.stringify(pollObj)} in ${collection}`;
        return fabric.query(updatePollQuery);
    }

    getPollData = async (pollName) => {
        const { fabric, collection, documentKey } = this.state;
        debugger;
        const query = `FOR x in ${collection} FILTER x._key=="${documentKey}" return x.polls`;
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
                getPollData: this.getPollData
            }}>
                {children}
            </FabricContext.Provider>
        )
    }
}

export default FabricContext;
export { FabricProvider };