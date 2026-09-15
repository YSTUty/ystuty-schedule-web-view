import React from 'react';

import { autocompleteClasses } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Popper, { PopperProps } from '@mui/material/Popper';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import type { AutocompleteChangeReason } from '@mui/material/useAutocomplete';

/** Максимальное число одновременно выбранных вариантов расписания. */
export const MAX_SCHEDULE_SELECTIONS = 3;

export type AllowMultipleRef = React.MutableRefObject<
  (isAllowed?: boolean) => void
>;

type ScheduleOptionsRefreshParams = {
  online?: boolean;
  previousOnline?: boolean;
  since?: Date;
};

const StyledScheduleSelectorPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    '& ul': { margin: 0 },
    '& li': { margin: 0 },
  },
});

/** Общий Popper для селекторов группы, преподавателя и аудитории. */
export const ScheduleSelectorPopper = (props: PopperProps) => (
  <StyledScheduleSelectorPopper {...props} style={{ width: 350 }} />
);

/** Подсказка о серверном кэше, не мешающая прокрутке выпадающего списка. */
export const ServerCacheTooltip = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Tooltip
    disableFocusListener
    disableInteractive
    enterTouchDelay={0}
    title="* кэш на сервере.">
    {/*
      Tooltip получает обычный DOM-элемент с ref и обработчиками hover.
      TextField не является надёжным anchor-элементом, когда его создаёт
      Autocomplete через renderInput.
    */}
    <Box sx={{ width: '100%' }}>{children}</Box>
  </Tooltip>
);

/** Проверяет, отличается ли новый набор значений от выбранного. */
export function areSameScheduleSelections<T>(
  left: readonly T[],
  right: readonly T[],
) {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

/** Сохраняет первое и последние выбранные варианты в разрешённом лимите. */
export function limitScheduleSelections<T>(items: readonly T[]) {
  if (items.length <= MAX_SCHEDULE_SELECTIONS) {
    return [...items];
  }

  return [items[0], ...items.slice(-(MAX_SCHEDULE_SELECTIONS - 1))];
}

/** Определяет, нужно ли обновить список вариантов после изменения сети. */
export function shouldRefreshScheduleOptions({
  online,
  previousOnline,
  since,
}: ScheduleOptionsRefreshParams) {
  return (
    online !== previousOnline ||
    (since !== undefined && Date.now() - since.getTime() > 2 * 60e3)
  );
}

/** Не меняет выбор при удалении варианта клавишей Backspace. */
export function shouldIgnoreAutocompleteRemoval(
  event: React.SyntheticEvent,
  reason: AutocompleteChangeReason,
) {
  return (
    event.type === 'keydown' &&
    (event as React.KeyboardEvent).key === 'Backspace' &&
    reason === 'removeOption'
  );
}
