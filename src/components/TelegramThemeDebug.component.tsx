import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { miniApp, themeParams, useSignal } from '@tma.js/sdk-react';

type ThemeValue = {
  label: string;
  value?: string;
};

function readCssVariable(name: string): string | undefined {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || undefined;
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();

  const isCopied = document.execCommand('copy');
  textarea.remove();

  if (!isCopied) {
    throw new Error('Clipboard access is unavailable');
  }
}

/**
 * Временный dev-блок для сопоставления палитры Telegram с итоговой MUI-темой.
 * Нужен для диагностики различий после сворачивания Mini App.
 */
const TelegramThemeDebug = () => {
  const theme = useTheme();
  const themeState = useSignal(themeParams.state);
  const [copyStatus, setCopyStatus] = useState<string>();
  const themeParamsValues = {
    bgColor: useSignal(themeParams.bgColor),
    secondaryBgColor: useSignal(themeParams.secondaryBgColor),
    sectionBgColor: useSignal(themeParams.sectionBgColor),
    headerBgColor: useSignal(themeParams.headerBgColor),
    bottomBarBgColor: useSignal(themeParams.bottomBarBgColor),
    buttonColor: useSignal(themeParams.buttonColor),
    textColor: useSignal(themeParams.textColor),
  };

  const values: ThemeValue[] = [
    { label: 'TG theme bg_color', value: themeParamsValues.bgColor },
    {
      label: 'TG theme secondary_bg_color',
      value: themeParamsValues.secondaryBgColor,
    },
    {
      label: 'TG theme section_bg_color',
      value: themeParamsValues.sectionBgColor,
    },
    {
      label: 'TG theme header_bg_color',
      value: themeParamsValues.headerBgColor,
    },
    {
      label: 'TG theme bottom_bar_bg_color',
      value: themeParamsValues.bottomBarBgColor,
    },
    { label: 'TG theme button_color', value: themeParamsValues.buttonColor },
    { label: 'TG theme text_color', value: themeParamsValues.textColor },
    { label: 'Mini App bgColor', value: miniApp.bgColorRgb() },
    { label: 'Mini App headerColor', value: miniApp.headerColorRgb() },
    {
      label: 'MUI background.default',
      value: theme.palette.background.default,
    },
    { label: 'MUI background.paper', value: theme.palette.background.paper },
    { label: 'MUI primary.main', value: theme.palette.primary.main },
    {
      label: 'CSS --tg-theme-bg-color',
      value: readCssVariable('--tg-theme-bg-color'),
    },
    {
      label: 'CSS --tg-theme-secondary-bg-color',
      value: readCssVariable('--tg-theme-secondary-bg-color'),
    },
    { label: 'CSS --tg-bg-color', value: readCssVariable('--tg-bg-color') },
    {
      label: 'CSS --tg-header-color',
      value: readCssVariable('--tg-header-color'),
    },
  ];
  const themeJson = JSON.stringify(themeState, null, 2);
  const handleCopy = useCallback(async () => {
    try {
      await copyText(themeJson);
      setCopyStatus('Скопировано');
    } catch {
      setCopyStatus('Не удалось скопировать');
    }
  }, [themeJson]);

  return (
    <Paper
      component="section"
      sx={{ my: 1, p: { xs: 2, md: 3 }, overflow: 'hidden' }}>
      <Typography component="h2" variant="h6">
        Telegram theme debug
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Видно только в dev-режиме Mini App.
      </Typography>
      <Button size="small" variant="outlined" onClick={handleCopy}>
        {copyStatus || 'Скопировать JSON'}
      </Button>
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        }}>
        {values.map(({ label, value }) => (
          <Box
            key={label}
            sx={{
              display: 'grid',
              gridTemplateColumns: '28px minmax(0, 1fr)',
              gap: 1,
              alignItems: 'center',
            }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: value || 'transparent',
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" component="div">
                {label}
              </Typography>
              <Typography
                variant="caption"
                component="code"
                sx={{ wordBreak: 'break-all' }}>
                {value || '—'}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box
        component="pre"
        sx={{
          maxHeight: 220,
          mt: 2,
          overflow: 'auto',
          fontSize: 11,
          whiteSpace: 'pre-wrap',
        }}>
        {themeJson}
      </Box>
    </Paper>
  );
};

export default TelegramThemeDebug;
