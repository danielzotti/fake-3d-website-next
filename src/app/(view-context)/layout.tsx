"use client";
import ViewContextLayout from "@/layouts/view-context-layout";
import {type ReactNode} from "react";

export default function ViewContextStateLayout({
                                                   children,
                                               }: Readonly<{
    children: ReactNode;
}>) {
    return <ViewContextLayout>
        {children}
    </ViewContextLayout>
}
