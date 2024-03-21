"use client";

import {PageContent} from "@/app/page-content";
import {ViewContextProvider} from "@/providers/ViewContextProvider";

export default function Home() {
    return <ViewContextProvider>
        <PageContent/>
    </ViewContextProvider>;
}
