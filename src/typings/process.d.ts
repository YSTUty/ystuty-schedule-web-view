/// <reference types="node" />

declare namespace NodeJS {
    interface ProcessEnv {
        readonly REACT_APP_API_URL: string;
        readonly REACT_APP_MAIN_HOST: string;
        readonly REACT_APP_PWA_HOST: string;
        readonly REACT_APP_YM_ID?: string;

        readonly REACT_APP_TELEGRAM_USERNAME?: string;
        readonly REACT_APP_TELEGRAM_BOT_NAME?: string;
        readonly REACT_APP_VK_BOT_GROUP_NAME?: string;
        readonly REACT_APP_HAWK_TOKEN?: string;

        readonly REACT_APP_LINK_YSTUTY?: string;
        readonly REACT_APP_LINK_2GH?: string;
        readonly REACT_APP_LINK_2VK?: string;
        readonly REACT_APP_LINK_2ICS?: string;

        readonly REACT_APP_VK_WIDGETS_API_ID?: string;
    }
}
