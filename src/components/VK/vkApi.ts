declare global {
    interface Window {
        VK: any;
        vkAsyncInit: any;
    }
}

export interface VKApiOptions {
    version?: number | string | null;
    onlyWidgets?: boolean | null;
    async?: boolean | null;
}

class VKApi {
    public promise: Promise<any> | null = null;

    constructor(public readonly apiId: number | string | null, public options: VKApiOptions = {}) {
        this.load();
    }

    public load() {
        if (this.promise) {
            return this.promise;
        }

        this.promise = new Promise((resolve) => {
            if (window.VK && window.VK.init) {
                this.init();
                resolve(window.VK);
            } else {
                window.vkAsyncInit = () => {
                    this.init();
                    resolve(window.VK);
                };
            }

            const baseUrl = `https://vk.com/js/api/openapi.js?${this.options.version}`;

            if (!document.getElementById('vk-openapi')) {
                const script = document.createElement('script');

                script.type = 'text/javascript';
                script.id = 'vk-openapi';
                script.src = baseUrl;
                script.async = this.options.async !== false;

                document.head.appendChild(script);
            }
        });

        return this.promise;
    }

    public init() {
        const {
            apiId,
            options: { onlyWidgets },
        } = this;

        if (apiId) {
            window.VK.init({ apiId, onlyWidgets });
        }
    }
}

export default VKApi;
