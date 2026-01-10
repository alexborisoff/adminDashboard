export const VALIDATION_RULES = {
   MIN_AGE: 0,
   MAX_AGE: 100,
   MIN_PASSWORD_LENGTH: 8,
   NAME_REGEX: /^[^\d]+$/,
   NAME_NO_DIGITS_REGEX: /\d/,
} ;

export const TOKEN_EXPIRATION = {
   DEFAULT: 3600, 
} ;

export const STORAGE_KEYS = {
   AUTH: 'authState',
   USERS: 'usersList',
   THEME: 'theme',
};
