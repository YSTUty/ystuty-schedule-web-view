import React from 'react';
import { IntlProvider } from 'react-intl';

const LocalizerComponent = ({ children }: any) => {
    // const { language } = useSelector((state) => state);
    const language = 'ru';
    const [messages, setMessages] = React.useState<Record<string, string>>();

    const fetchLocale = React.useCallback((locale) => {
        import('../assets/locale/' + locale + '.json').then((messages) => setMessages(messages.default));
    }, []);

    React.useEffect(() => {
        fetchLocale(language);
    }, [language, fetchLocale]);

    return (
        <>
            {messages && (
                <IntlProvider locale={language} messages={messages} key={language}>
                    {children}
                </IntlProvider>
            )}
        </>
    );
};

export default LocalizerComponent;
