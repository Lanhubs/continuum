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
            clientId: "oauth-client-id",
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
