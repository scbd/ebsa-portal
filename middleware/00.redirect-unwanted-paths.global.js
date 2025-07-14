/**
 * @fileoverview Global middleware to redirect unwanted system asset requests
 * @description Prevents useFetch warnings by intercepting requests for favicon, well-known paths, and external fonts
 * @author Randy Houlahan
 * @since 2025-06-19
 * @see {@link https://nuxt.com/docs/guide/directory-structure/middleware} Nuxt Middleware Documentation
 */

/**
 * Global route middleware that redirects unwanted system asset requests to the home page
 * 
 * This middleware prevents useFetch warnings caused by browser requests for system assets
 * like favicon.ico, .well-known paths, and Google Fonts. These requests would otherwise
 * be processed by Vue components and trigger unnecessary API calls.
 * 
 * @function redirectUnwantedPathsMiddleware
 * @param {Object} to - The target route object being navigated to
 * @param {string} to.path - The path of the target route
 * @param {Object} from - The current route object being navigated from
 * @returns {void|NavigationResult} Returns navigation redirect if path matches unwanted patterns
 * 
 * @example
 * // Browser requests '/favicon.ico' -> redirects to '/' with 301 status
 * // Browser requests '/.well-known/security.txt' -> redirects to '/' with 301 status
 * // Browser requests '/fonts.googleapis.com/css?family=Inter' -> redirects to '/' with 301 status
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301} HTTP 301 Status Code
 */
export default defineNuxtRouteMiddleware((to, from) => {
    /**
     * Array of path patterns that should be redirected to prevent useFetch warnings
     * @type {string[]}
     * @const
     */
    const unwantedPaths = [
        '/favicon.ico',           // Browser favicon requests
        '/.well-known',          // RFC 8615 well-known URIs
        '/fonts.googleapis.com', // Google Fonts CSS requests
        '/fonts.googleapis.com/css' // Specific Google Fonts CSS endpoint
    ];
    
    /**
     * Check if the current path should be redirected
     * @type {boolean}
     */
    const shouldRedirect = unwantedPaths.some(unwantedPath => to.path.startsWith(unwantedPath));
    
    if (shouldRedirect) {
        /**
         * Redirect to home page with 301 status code for SEO compliance
         * @returns {NavigationResult} Nuxt navigation result with redirect
         */
        return navigateTo('/', { redirectCode: 301 });
    }
});
