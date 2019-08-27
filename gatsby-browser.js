import React from "react";

import { FabricProvider } from "./src/context/JSC8Context"
export const wrapRootElement = ({ element }) => (
    <FabricProvider>{element}</FabricProvider>
);