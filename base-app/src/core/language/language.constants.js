import projectPackage from '../../../package.json';

const { language } = projectPackage[projectPackage.name];

export const LanguageConstants = Object.freeze(language);
