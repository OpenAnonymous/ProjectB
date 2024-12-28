 
import path from 'path';
import {config} from 'dotenv';
config();
//MONGODB
export const MONGODB_URI = process.env.MONGODB_URI;
export const MONGODB_PASS = process.env.MONGODB_PASS;

//HOST PORT
export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const APP_URL_API = `http://${HOST}:${PORT}/`

//URL
export const APP_URL_CLIENT = process.env.APP_URL_CLIENT

//API
export const LIMIT = process.env.LIMITREQUEST

//DEFAULT ACC 
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

//KEY
export const SECRET_KEY_ADMIN = process.env.SECRET_KEY_ADMIN;
export const SECRET_KEY_USER = process.env.SECRET_KEY_USER;
export const KEY_GENERATOR = process.env.KEY_GENERATOR;

export const MAIL_SERVICE = process.env.MAIL_SERVICE;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

//derectory
export const SOURCE_DIR = path.join(__dirname);
export const SOURCE_MAIN = path.dirname(SOURCE_DIR);
export const STORAGE_DIR = path.join(path.dirname(SOURCE_MAIN),"//", "public//upload");
export const VIEWS_DIR = path.join(SOURCE_MAIN,"views");
export const STYLES_DIR = path.join(SOURCE_MAIN,"public");

//HASH
export const SALT_ROUND = process.env.SALT_ROUND;
//eslint
export const ESLINT_TEST = process.env.ESLINT_TEST;

//token
export const TOKEN_EXP = process.env.TOKEN_EXP;
export const ALGORITHM = process.env.ALGORITHM;

export const JOI_DEFAULT_MESSAGE = {
    // boolean
    "boolean.base": "{{#label}} sai định dạng.",

    // string
    "string.base": "{{#label}} sai định dạng.",
    "string.empty": "{{#label}} không được bỏ trống.",
    "string.min": "{{#label}} không được ít hơn {{#limit}} ký tự.",
    "string.max": "{{#label}} không được vượt quá {{#limit}} ký tự.",
    "string.pattern.base": "{{#label}} không đúng định dạng.",
    "string.email": "{{#label}} không đúng định dạng.",

    // number
    "number.base": "{{#label}} sai định dạng.",
    "number.integer": "{{#label}} sai định dạng.",
    "number.min": "{{#label}} không được nhỏ hơn {{#limit}}.",
    "number.max": "{{#label}} không được lớn hơn {{#limit}}.",

    // array
    "array.base": "{{#label}} sai định dạng.",
    "array.unique": "Các {{#label}} không được giống nhau.",
    "array.min": "{{#label}} không được ít hơn {{#limit}} phần tử.",
    "array.max": "{{#label}} không được vượt quá {{#limit}} phần tử.",
    "array.length": "{{#label}} phải có đúng {{#limit}} phần tử.",
    "array.includesRequiredUnknowns": "{{#label}} không hợp lệ.",
    "array.includesRequiredKnowns": "{{#label}} không hợp lệ.",

    // object
    "object.base": "{{#label}} sai định dạng.",
    "object.unknown": "Trường {#key} không được xác định.",
    "object.instance": "{{#label}} không đúng định dạng.",

    // binary
    "binary.base": "{{#label}} sai định dạng.",
    "binary.min": "{{#label}} không được ít hơn {{#limit}} bytes.",
    "binary.max": "{{#label}} không được vượt quá {{#limit}} bytes.",

    // any
    "any.only": "{{#label}} phải là {if(#valids.length == 1, '', 'một trong ')}{{#valids}}.",
    "any.required": "{{#label}} không được bỏ trống.",
    "any.unknown": "Trường {#key} không được xác định.",
    "any.invalid": "{{#label}} không hợp lệ.",
    "any.exists": "{{#label}} đã tồn tại.",
    "any.notFound": "{{#label}} không tồn tại"
};

export const JOI_DEFAULT_OPTIONS = {
    abortEarly: false,
    errors: {
        wrap: {label: false},
        language: {"any.exists": "any.exists"},
    },
    externals: false,
    stripUnknown: true,
};