import { Router } from 'express';
import { AppRequest, AppResponse } from './types';
import { Request, Response } from 'express';
export declare class BasicRoutes {
    basePath: string;
    templatePath: string;
    errorMessage: string;
    router: Router;
    constructor(basePath?: string, errorMessage404?: string, serverErrorMessage?: string);
    private initializeRouter;
    private error;
    showError(res: AppResponse, code?: number, message?: string): void;
    getCookie(req: Request, name: string): void;
    setLocale(req: Request, res: Response): void;
    setCookie(req: AppRequest, name: string, value: string | number | boolean, options?: {}): void;
    renderLayout(page: string, renderFn: any): any;
    redirect(res: AppResponse, url: string): void;
    renderPage(path: string, page: string, renderFn: any): any;
    addGET(path: string, handler: any): void;
    addPOST(path: string, handler: any): void;
    addErrorRoute(): void;
    getAll(): any;
}
