import { createAuthClient } from "better-auth/react";
// import { oneTapClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    fetchOptions: {
        credentials: "include",
    },
    /* 
    plugins: [
        oneTapClient({
            clientId: "870743279666-rv17tvnh2umuggm9b7iv4g4eddisn9v9.apps.googleusercontent.com",
            autoSelect: false,
            // cancelOnTapOutside: true,
            context: "signin",
            promptOptions: {
                fedCM: true,
            },
        }),
    ],
    */
});
