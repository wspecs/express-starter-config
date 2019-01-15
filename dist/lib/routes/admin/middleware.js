"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminMiddleware {
    use(req, res, next) {
        if (['/login', '/logout', '/register', '/forgot'].some(x => x === req.path)) {
            next();
            return;
        }
        if (req.path.startsWith('/assets/') || req.path.startsWith('/docs/')) {
            next();
            return;
        }
        if (req.adminSession.user) {
            next();
            return;
        }
        res.redirect('/admin/login');
    }
}
exports.AdminMiddleware = AdminMiddleware;
