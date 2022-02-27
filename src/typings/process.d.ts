/// <reference types="node" />

declare namespace NodeJS {
    interface ProcessEnv {
        readonly REACT_APP_API_URL: string;
        readonly REACT_APP_MAIN_HOST: string;
        readonly REACT_APP_PWA_HOST: string;
        readonly REACT_APP_YM_ID?: string;
    }
}
