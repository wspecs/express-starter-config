import { AppRequest, AppResponse, Map } from './types';
export declare const minificationOptions: {
    collapseBooleanAttributes: boolean;
    collapseInlineTagWhitespace: boolean;
    collapseWhitespace: boolean;
    conservativeCollapse: boolean;
    decodeEntities: boolean;
    html5: boolean;
    minifyCSS: boolean;
    minifyJS: boolean;
    minifyURLs: boolean;
    removeComments: boolean;
    removeAttributeQuotes: boolean;
    removeEmptyAttributes: boolean;
    removeOptionalTags: boolean;
};
export declare function resolveRequest(err: Error, res: AppResponse, body?: {}): void;
export declare function minifyResponse(res: AppResponse, name: string, data: Map, cachePath?: string): void;
export declare function serve(req: AppRequest, res: AppResponse): void;
export declare function resolve(req: AppRequest, res: AppResponse): void;
