import {useAuth0} from '@auth0/auth0-react';
import {useContext} from 'react';
import {tivoContext} from '@/components/TivoContext';

export const useFetch = () => {
    const {getAccessTokenSilently} = useAuth0();
    const context = useContext(tivoContext);

    return async (url : string | URL, options : RequestInit | undefined = {}) => {
        const token = await getAccessTokenSilently();

        if (!options) {
            options = {};
        }

        options.headers = new Headers(options.headers);
        options.headers.append('Authorization', 'Bearer ' + token);
        return await fetch((context?.apiBaseUrl ?? '') + url.toString(), options);
    };
};
