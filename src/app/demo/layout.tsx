"use client";
import ViewContextLayout from "@/layouts/view-context-layout";
import {ReactNode} from "react";

export default function DemoLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return <ViewContextLayout>
        {children}
    </ViewContextLayout>
}
