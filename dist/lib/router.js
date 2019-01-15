"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Cookies = require("cookies");
const PAGE_NOT_FOUND = "Oops, the page you're looking for is missing.";
const SERVER_ERROR = 'Something went wrong!';
class BasicRoutes {
    constructor(basePath = '', errorMessage404 = PAGE_NOT_FOUND, serverErrorMessage = SERVER_ERROR) {
        this.basePath = '';
        this.templatePath = '';
        this.basePath = basePath;
        this.errorMessage = errorMessage404;
        this.router = express_1.Router();
        this.router.use((req, res, next) => {
            this.initializeRouter(req, res, serverErrorMessage);
            next();
        });
    }
    initializeRouter(req, res, serverErrorMessage) {
        if (this.basePath) {
            req.basePath = '/' + this.basePath;
            this.templatePath = this.basePath + '/';
        }
        else {
            req.basePath = this.basePath;
        }
        req.cookies = new Cookies(req, res);
        req.errorFunction = this.showError;
        req.serverErrorMessage = serverErrorMessage;
    }
    error(req, res) {
        return this.showError(res, 404);
    }
    showError(res, code = 404, message = this.errorMessage) {
        const page = { error: { code, message } };
        res.status(code);
        res.serve(this.templatePath + 'error', page);
    }
    getCookie(req, name) {
        req.cookies.get(name);
    }
    setLocale(req, res) {
        let locale = req.params.locale;
        console.log('locale before', locale);
        if (locale == null) {
            locale = this.getCookie(req, 'locale');
        }
        if (locale) {
            res.cookie('locale', locale, {
                sameSite: true,
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            req.setLocale(locale);
        }
    }
    setCookie(req, name, value, options = {}) {
        req.cookies.set(name, value, Object.assign({ httpOnly: true, path: '/' + this.basePath }, options));
    }
    renderLayout(page, renderFn) {
        return this.renderPage(this.templatePath + 'layout', page, renderFn);
    }
    redirect(res, url) {
        res.redirect('/' + this.templatePath + url);
    }
    renderPage(path, page, renderFn) {
        return renderFn(path, page);
    }
    addGET(path, handler) {
        this.router.get(this.basePath + path, (req, res) => {
            this.setLocale(req, res);
            handler(req, res);
        });
    }
    addPOST(path, handler) {
        this.router.post(this.basePath + path, (req, res) => {
            this.setLocale(req, res);
            handler(req, res);
        });
    }
    addErrorRoute() {
        this.addGET('*', (req, res) => this.error(req, res));
    }
    getAll() {
        return this.router;
    }
}
exports.BasicRoutes = BasicRoutes;
