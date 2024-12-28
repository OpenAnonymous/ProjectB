import express from 'express';
import { VIEWS_DIR, STYLES_DIR } from '@/config';

const ejs = (req, res, next) => {
    req.app.set('views', VIEWS_DIR);
    req.app.set('view engine', 'ejs');
    req.app.use(express.static(STYLES_DIR));
    next();
}

export default ejs;