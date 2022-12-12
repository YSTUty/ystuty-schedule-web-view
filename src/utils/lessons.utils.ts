import { red, green, teal, blue, yellow } from '@mui/material/colors';
import ColorHash from 'color-hash';
import { LessonFlags } from '../interfaces/ystuty.types';

export const getLessonTypeStrArr = (type: LessonFlags) => {
    const types: string[] = [];
    if (type & LessonFlags.Lecture) types.push('Лек');
    if (type & LessonFlags.Practical) types.push('ПР');
    if (type & LessonFlags.Labaratory) types.push('ЛР');
    if (type & LessonFlags.CourseProject) types.push('КП');
    if (type & LessonFlags.Consultation) types.push('Консультация');
    if (type & LessonFlags.DifferentiatedTest) types.push('ДИФ.ЗАЧ');
    if (type & LessonFlags.Test) types.push('ЗАЧ');
    if (type & LessonFlags.Exam) types.push('ЭКЗ');
    if (type & LessonFlags.Library) types.push('Библиотека');
    if (type & LessonFlags.ResearchWork) types.push('НИР');
    if (type & LessonFlags.None) types.push('???');
    return types;
};

export const getLessonColor = (type: LessonFlags) => {
    switch (type) {
        case type & LessonFlags.Lecture:
            return green;
        case type & LessonFlags.Practical:
            return yellow;
        case type & LessonFlags.Labaratory:
            return blue;
        case type & LessonFlags.CourseProject:
            return red;
        case type & LessonFlags.Consultation:
            return green;
        case type & LessonFlags.Test:
            return teal;
        case type & LessonFlags.DifferentiatedTest:
            return red;
        case type & LessonFlags.Exam:
            return red;
        case type & LessonFlags.Library:
            return teal;
        case type & LessonFlags.ResearchWork:
            return yellow;
        case type & LessonFlags.None:
            return red;
        default:
            return yellow;
    }
};

export const hashColorDate = (isDark = false) =>
    new ColorHash({
        hue: { min: 90, max: 270 },
        lightness: isDark ? [0.35, 0.4, 0.5] : [0.4, 0.5, 0.65],
    });
export const hashColorTime = (isDark = false) =>
    new ColorHash({
        hue: { min: 90, max: 180 },
        lightness: isDark ? [0.35, 0.4, 0.5] : [0.4, 0.5, 0.65],
    });
export const hashColorAudience = (isDark = false) =>
    new ColorHash({
        lightness: isDark ? [0.35, 0.4, 0.5] : [0.4, 0.5, 0.65],
        saturation: isDark ? 0.5 : 0.8,
    });
