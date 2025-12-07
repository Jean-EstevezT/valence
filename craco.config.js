const fs = require('fs');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const paths = require('react-scripts/config/paths');

module.exports = {
    devServer: (devServerConfig, { env, paths: cracoPaths, proxy, allowedHost }) => {
        // Remove deprecated options
        delete devServerConfig.onBeforeSetupMiddleware;
        delete devServerConfig.onAfterSetupMiddleware;

        // Use the new setupMiddlewares option
        devServerConfig.setupMiddlewares = (middlewares, devServer) => {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            // "onBeforeSetupMiddleware" logic
            // Keep `evalSourceMapMiddleware`
            // middlewares before `redirectServedPath` otherwise will not have any effect
            // This lets us fetch source contents from webpack for the error overlay
            middlewares.unshift({
                name: 'evalSourceMapMiddleware',
                middleware: evalSourceMapMiddleware(devServer),
            });

            if (fs.existsSync(paths.proxySetup)) {
                // This registers user provided middleware for proxy reasons
                require(paths.proxySetup)(devServer.app);
            }

            // "onAfterSetupMiddleware" logic
            // Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
            middlewares.push({
                name: 'redirectServedPath',
                middleware: redirectServedPath(paths.publicUrlOrPath),
            });

            // This service worker file is effectively a 'no-op' that will reset any
            // previous service worker registered for the same host:port combination.
            middlewares.push({
                name: 'noopServiceWorkerMiddleware',
                middleware: noopServiceWorkerMiddleware(paths.publicUrlOrPath),
            });

            return middlewares;
        };

        return devServerConfig;
    },
};
