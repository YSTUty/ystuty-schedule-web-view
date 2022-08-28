import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'clsx';

import { styled } from '@mui/material/styles';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

import scheduleSlice from '../store/reducer/schedule/schedule.slice';
import { LessonFlags } from '../interfaces/ystuty.types';

const PREFIX = 'LTS';

const classes = {
    locationSelector: `${PREFIX}-locationSelector`,
    button: `${PREFIX}-button`,
    selectedButton: `${PREFIX}-selectedButton`,
    longButtonText: `${PREFIX}-longButtonText`,
    shortButtonText: `${PREFIX}-shortButtonText`,
};

const StyledButtonGroup = styled(ButtonGroup)(({ theme: { spacing, palette } }) => ({
    [`&.${classes.locationSelector}`]: {
        marginLeft: spacing(1),
        height: spacing(4.875),
    },
    [`& .${classes.longButtonText}`]: {
        '@media (max-width: 1200px)': {
            display: 'none',
        },
    },
    [`& .${classes.shortButtonText}`]: {
        '@media (min-width: 1200px)': {
            display: 'none',
        },
    },
    [`& .${classes.button}`]: {
        paddingLeft: spacing(1),
        paddingRight: spacing(1),
        width: spacing(12),
        '@media (max-width: 1200px)': {
            width: spacing(2),
            fontSize: '0.75rem',
        },
        '@media (max-width: 800px)': {
            width: spacing(1),
            fontSize: '0.70rem',
        },
        '@media (max-width: 600px)': {
            display: 'none',
        },
    },
    [`& .${classes.selectedButton}`]: {
        background: (palette.primary as any)[400],
        color: (palette.primary as any)[50],
        '&:hover': {
            backgroundColor: (palette.primary as any)[500],
        },
        border: `1px solid ${(palette.primary as any)[400]}!important`,
        borderLeft: `1px solid ${(palette.primary as any)[50]}!important`,
        '&:first-of-type': {
            borderLeft: `1px solid ${(palette.primary as any)[400]}!important`,
        },
    },
}));

const LESSON_TYPES = [
    LessonFlags.Lecture,
    LessonFlags.Labaratory,
    LessonFlags.Practical,
    LessonFlags.CourseProject,
    LessonFlags.Consultation,
    LessonFlags.Test,
    LessonFlags.DifferentiatedTest,
    LessonFlags.Exam,
    LessonFlags.Library,
];
const LESSON_TYPE_SHORT_NAMES = ['Лек', 'ЛР', 'ПР', 'КП', 'КОН', 'ЗАЧ', 'ДИФ', 'ЭКЗ', 'БИБЛ', 'НИР'];
const LESSON_TYPE_NAMES = [
    'Лекции',
    'Лабы',
    'Практики',
    'Курсовые',
    'Консультации',
    'Зачеты',
    'Диф. зачеты',
    'Экзамены',
    'Библиотека',
    'НИР',
];

const getButtonClass = (lessonTypes: LessonFlags[], type: LessonFlags) =>
    lessonTypes.includes(type) && classes.selectedButton;

const LessonTypeSelector = (props: { allowedLessonTypes?: LessonFlags[] }) => {
    const { lessonTypes } = useSelector((state) => state.schedule);
    const dispatch = useDispatch();

    // TODO: add drop-down list for mobile
    return (
        <StyledButtonGroup className={classes.locationSelector}>
            {LESSON_TYPES.map(
                (type, index) =>
                    !props.allowedLessonTypes ||
                    (props.allowedLessonTypes.includes(type) && (
                        <Button
                            className={classNames(
                                classes.button,
                                /* classes.longButtonText, */ getButtonClass(lessonTypes, type)
                            )}
                            onClick={() => dispatch(scheduleSlice.actions.toggleSelectedTypeLessons(type))}
                            key={type}
                        >
                            <span className={classes.shortButtonText}>{LESSON_TYPE_SHORT_NAMES[index]}</span>
                            <span className={classes.longButtonText}>{LESSON_TYPE_NAMES[index]}</span>
                        </Button>
                    ))
            )}
        </StyledButtonGroup>
    );
};

export default LessonTypeSelector;
