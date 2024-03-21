import {ViewState} from "@/models/view-state.models";
import {createContext, ReactNode, useContext, useState} from "react";

export const ViewContext = createContext<{
    viewState: ViewState,
    setViewState: (s: ViewState | ((s: ViewState) => ViewState)) => void
}>({
    viewState: {
        x: 0,
        y: 0,
    },
    setViewState: () => {
    }
});

export const useViewContext = () => {
    return useContext(ViewContext);
}

export const ViewContextProvider = ({children}: { children: ReactNode }) => {

    const [viewState, setViewState] = useState<ViewState>({
        x: 0,
        y: 0,
    });

    return (
        <ViewContext.Provider value={{viewState, setViewState}}>
            {children}
        </ViewContext.Provider>
    )
}
