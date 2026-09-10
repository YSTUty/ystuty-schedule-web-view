/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="@hawk.so/vite-plugin/global" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_URL_INTERNAL?: string;
  readonly VITE_API_URL_LOCAL?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_DEV_TEAM_NAME?: string;
  readonly VITE_GENERATE_SOURCEMAP?: string;
  readonly VITE_HAWK_TOKEN?: string;
  readonly VITE_LINK_2GH?: string;
  readonly VITE_LINK_2ICS?: string;
  readonly VITE_LINK_2VK?: string;
  readonly VITE_LINK_SUPPORT?: string;
  readonly VITE_LINK_YSTUTY?: string;
  readonly VITE_MAIN_HOST?: string;
  readonly VITE_PWA_HOST?: string;
  readonly VITE_PWA_HOST_OLD?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SUPPORT_EMAIL?: string;
  readonly VITE_SUPPORT_TG_USERNAME?: string;
  readonly VITE_TELEGRAM_BOT_NAME?: string;
  readonly VITE_TELEGRAM_USERNAME?: string;
  readonly VITE_VK_BOT_GROUP_NAME?: string;
  readonly VITE_VK_WIDGETS_API_ID?: string;
  readonly VITE_YM_ID?: string;
}

declare const isDev: boolean;
declare const __APP_VERSION__: string;
/** В формате `MM.DD HH:mm`. */
declare const __BUILD_DATE__: string;
declare const __BUILD_G_HASH__: string | null;
declare const __BUILD_TIMESTAMP__: number;
