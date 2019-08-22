import React from "react";

import { FabricProvider } from "./src/context/JSC8Context"
export const wrapRootElement = ({ element }) => (
    // element
    <FabricProvider>{element}</FabricProvider>
);