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

    onSubmitVote = (data) => {
        // const { documentKey, collection, fabric } = this.state;
        // const query = `UPDATE "${documentKey}" WITH ${JSON.stringify(obj)} IN ${collection}`;
        // return fabric.query(query);

        // ABHISHEK: see how demo handles it
    }

    getData() { }

    render() {
        const { isSignedIn, fabric } = this.state;
        const { children } = this.props;
        return (
            <FabricContext.Provider value={{
                isSignedIn,
                fabric,
                updateFabric: this.updateFabric,
                updateCollectionData: this.updateCollectionData
            }}>
                {children}
            </FabricContext.Provider>
        )
    }
}

export default FabricContext;
export { FabricProvider };