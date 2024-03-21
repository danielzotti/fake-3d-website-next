import {MetadataRoute} from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Fake 3D Website",
        short_name: "Fake 3D Website",
        description: "Your description",
        start_url: "/",
        display: "standalone",
        background_color: "#000",
        theme_color: "#fff",
        icons: [
            {
                src: "/images/3d-logo.png",
                sizes: "256x256",
                type: "image/png",
            }
        ],
    };
}
