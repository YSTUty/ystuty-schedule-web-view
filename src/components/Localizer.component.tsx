import React from 'react';
import { IntlProvider } from 'react-intl';

const localeModules = import.meta.glob<{ default: Record<string, string> }>(
  '../assets/locale/*.json',
);

const LocalizerComponent = ({ children }: any) => {
  // const { language } = useSelector((state) => state);
  const language = 'ru';
  const [messages, setMessages] = React.useState<Record<string, string>>();

  const fetchLocale = React.useCallback((locale: string) => {
    const loadLocale = localeModules[`../assets/locale/${locale}.json`];
    loadLocale?.().then((messages) => setMessages(messages.default));
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
