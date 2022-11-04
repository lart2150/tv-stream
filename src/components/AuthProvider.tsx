import { Auth0Provider } from "@auth0/auth0-react";
import { ReactNode, useContext } from "react";
import { tivoContext } from "./TivoContext";

type Props = {
    children : ReactNode;
};

export const AuthProvider = ({children} : Props) => {
    const context = useContext(tivoContext);

    if (!context) {
        return <>Loading config...</>
    }

    return <Auth0Provider
        domain={context.domain}
        clientId={context.clientID}
        redirectUri={window.location.origin}
        audience={context.audience}
    >
        {children}
    </Auth0Provider>
}