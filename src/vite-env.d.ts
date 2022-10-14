/// <reference types="vite/client" />

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions,@typescript-eslint/no-empty-interface
interface ImportMetaEnv {
    /* eslint-disable @typescript-eslint/naming-convention */
    /**
     * @todo define env variables here
     * @example readonly VITE_APP_MY_VARIABLE : string;
     */
    /* eslint-enable @typescript-eslint/naming-convention */
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMeta {
    readonly env : ImportMetaEnv;
}
