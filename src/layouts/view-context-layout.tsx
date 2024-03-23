"use client";

import {ViewContextProvider} from "@/providers/ViewContextProvider";
import {ReactNode} from "react";

export default function ViewContextLayout({
                                              children,
                                          }: Readonly<{
    children: ReactNode;
}>) {

    return <ViewContextProvider>
        {children}
    </ViewContextProvider>;
}
