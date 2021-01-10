import React from "react";
import { render  } from "@testing-library/react";

import Sonifier from "./Sonifier";
import { SonifierProps  } from "./Sonifier.types";

describe("Sonifier Component", () => {
    let props: SonifierProps;

    beforeEach(() => {
        props = {
            aProp: "A test prop"
        };
    });

    const renderComponent = () => render(<Sonifier {...props} />);

    it("should render", () => {
        const { baseElement } = renderComponent();

        expect(baseElement).toHaveTextContent("A test prop");
    });
});
