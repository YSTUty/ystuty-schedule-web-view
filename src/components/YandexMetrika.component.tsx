import { YMInitializer } from 'react-yandex-metrika';

export const YandexMetrika = () => {
    const YM_ID = Number(process.env.REACT_APP_YM_ID);
    if (!YM_ID) return null;

    return (
        <>
            <YMInitializer accounts={[YM_ID]} options={{ webvisor: true }} version="2" />
            <noscript>
                <div>
                    <img
                        src={`https://mc.yandex.ru/watch/${YM_ID}`}
                        style={{ position: 'absolute', left: '-9999px' }}
                        alt=""
                    />
                </div>
            </noscript>
        </>
    );
};
