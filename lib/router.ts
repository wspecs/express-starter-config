import { Router, NextFunction } from 'express';
import { AppRequest, AppResponse } from './types';
import { Request, Response } from 'express';
import * as Cookies from 'cookies';

const PAGE_NOT_FOUND = "Oops, the page you're looking for is missing.";
const SERVER_ERROR = 'Something went wrong!';

export class BasicRoutes {
  basePath = '';
  templatePath = '';
  errorMessage: string;
  router: Router;

  constructor(
    basePath: string = '',
    errorMessage404 = PAGE_NOT_FOUND,
    serverErrorMessage = SERVER_ERROR
  ) {
    this.basePath = basePath;
    this.errorMessage = errorMessage404;
    this.router = Router();
    this.router.use((req: any, res: any, next: NextFunction) => {
      this.initializeRouter(req, res, serverErrorMessage);
      next();
    });
  }

  private initializeRouter(
    req: AppRequest,
    res: AppResponse,
    serverErrorMessage: string
  ) {
    if (this.basePath) {
      req.basePath = '/' + this.basePath;
      this.templatePath = this.basePath + '/';
    } else {
      req.basePath = this.basePath;
    }
    req.cookies = new Cookies(req as any, res as any);
    req.errorFunction = this.showError;
    req.serverErrorMessage = serverErrorMessage;
  }

  private error(req: any, res: any) {
    return this.showError(res, 404);
  }

  showError(res: AppResponse, code = 404, message = this.errorMessage) {
    const page = { error: { code, message } };
    res.status(code);
    res.serve(this.templatePath + 'error', page);
  }

  getCookie(req: Request, name: string) {
    req.cookies.get(name);
  }

  setLocale(req: Request, res: Response) {
    let locale = req.params.locale;
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

  setCookie(
    req: AppRequest,
    name: string,
    value: string | number | boolean,
    options = {}
  ) {
    req.cookies.set(name, value, {
      httpOnly: true,
      path: '/' + this.basePath,
      ...options
    });
  }

  renderLayout(page: string, renderFn: any) {
    return this.renderPage(this.templatePath + 'layout', page, renderFn);
  }

  redirect(res: AppResponse, url: string) {
    res.redirect('/' + this.templatePath + url);
  }

  renderPage(path: string, page: string, renderFn: any) {
    return renderFn(path, page);
  }

  addGET(path: string, handler: any) {
    this.router.get(this.basePath + path, (req: Request, res: Response) => {
      this.setLocale(req, res);
      handler(req, res);
    });
  }

  addPOST(path: string, handler: any) {
    this.router.post(this.basePath + path, (req: Request, res: Response) => {
      this.setLocale(req, res);
      handler(req, res);
    });
  }

  addErrorRoute() {
    this.addGET('*', (req: any, res: any) => this.error(req, res));
  }

  getAll() {
    return this.router;
  }
}
