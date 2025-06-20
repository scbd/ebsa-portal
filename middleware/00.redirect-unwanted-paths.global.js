export default defineNuxtRouteMiddleware((to, from) => {
    // Paths that should be redirected to home
    const unwantedPaths = [
        '/favicon.ico',
        '/.well-known',
        '/fonts.googleapis.com',
        '/fonts.googleapis.com/css'
    ];
    
    // Check if the current path should be redirected
    const shouldRedirect = unwantedPaths.some(unwantedPath => to.path.startsWith(unwantedPath));
    
    if (shouldRedirect) {
        return navigateTo('/', { redirectCode: 301 });
    }
});
