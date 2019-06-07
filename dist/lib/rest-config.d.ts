import { Application, Request, Response, NextFunction } from 'express';
export interface Handler {
    (req: Request, res: Response, next: NextFunction): void;
}
export interface AppConfiguratorOptions {
    publicPathHandler?: Handler | null;
    port?: number | null;
}
export declare function configureApp(options: AppConfiguratorOptions, locales?: string[]): Application;
export declare function configureRest(app: Application, express: any, locales: string[] | undefined, { publicPathHandler }: AppConfiguratorOptions): void;
