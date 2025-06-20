/**
 * @fileoverview Menu-related composables for EBSA Portal navigation
 * @description Provides reactive menu utilities, level detection, and API integration for navigation components
 * @author SCBD DEVOPS
 * @since 2025-06-19
 * @see {@link https://nuxt.com/docs/guide/directory-structure/composables} Nuxt Composables Documentation
 * 
 * EXPORTED FUNCTIONS:
 * • useMenuLevels() - Detects navigation menu levels (top/second/third) based on current route
 * • useParentPath() - Determines parent path for breadcrumb navigation
 * • useHomePath() - Generates appropriate home path accounting for i18n
 * • useTopMenus() - Fetches and transforms top-level menu data from CBD API
 * • cleanMenus() - Legacy menu data transformer (deprecated)
 */

/**
 * Composable for determining navigation menu levels based on current route
 * 
 * Analyzes the current route path to determine which level of navigation
 * the user is currently viewing, accounting for internationalization.
 * 
 * @function useMenuLevels
 * @returns {Object} Menu level detection utilities
 * @returns {ComputedRef<boolean>} returns.isTopLevel - True if on top-level page
 * @returns {ComputedRef<boolean>} returns.isSecondLevel - True if on second-level page  
 * @returns {ComputedRef<boolean>} returns.isThirdLevel - True if on third-level page
 * @returns {ComputedRef<string[]>} returns.routeArray - Array of route path segments
 * @returns {ComputedRef<boolean>} returns.isEn - True if current locale is English
 * @returns {Function} returns.isFirstLevel - Function to check if menu item is first level
 * @returns {Function} returns.firstLevel - Function to get first level path from any path
 * 
 * @example
 * const { isTopLevel, isSecondLevel, routeArray } = useMenuLevels();
 * 
 * // Usage in template
 * if (isTopLevel.value) {
 *   // Show top-level navigation
 * }
 */
export const useMenuLevels = () => {
    const { locale }         = useI18n();
    const   route            = useRoute();
    const   isEn             = computed(()=> locale.value === 'en');
    const   routeArray       = computed(()=> route.path.split('/').filter(x=>x));
    const   isTopLevel       = computed(()=> unref(isEn)? routeArray.value?.length === 1 : routeArray.value?.length === 2);
    const   isSecondLevel    = computed(()=> unref(isEn)? routeArray.value?.length === 2 : routeArray.value?.length === 3);
    const   isThirdLevel     = computed(()=> unref(isEn)? routeArray.value?.length === 3 : routeArray.value?.length === 4);  

    /**
     * Check if a menu item represents a first-level navigation item
     * @param {Object} aMenu - Menu object with path property
     * @param {string} aMenu.path - The path of the menu item
     * @returns {boolean} True if menu item is first level
     */
    const isFirstLevel = (aMenu) => isEn.value? aMenu.path.split('/').length === 2 : aMenu.path.split('/').length === 3;
    
    /**
     * Extract the first-level path from any given path
     * @param {string} path - Full path to extract first level from
     * @returns {string} First-level path
     */
    const firstLevel = (path) => isEn.value? `/`+path.split('/')[1]: `/`+path.split('/')[2];


    return { isTopLevel, isSecondLevel, isThirdLevel, routeArray, isEn, isFirstLevel, firstLevel };
}

/**
 * Composable for determining parent path of current route
 * 
 * Provides utilities to check if the current route has a parent
 * and retrieve the parent path for breadcrumb navigation.
 * 
 * @function useParentPath
 * @returns {Object} Parent path utilities
 * @returns {ComputedRef<boolean>} returns.hasParent - True if current route has a parent
 * @returns {ComputedRef<string|null>} returns.parentPath - Parent path or null if none
 * 
 * @example
 * const { hasParent, parentPath } = useParentPath();
 * 
 * if (hasParent.value) {
 *   // Show back button to parentPath.value
 * }
 */
export const useParentPath = () => {
    const   route    = useRoute();

    const hasParent  = computed(()=> !!getParentPath(route.path));
    const parentPath = computed(()=> getParentPath(route.path));

    return { parentPath, hasParent };
}

/**
 * Composable for generating home path based on current locale and route
 * 
 * Returns a function that can determine the appropriate home path
 * for any given route, accounting for internationalization.
 * 
 * @function useHomePath
 * @returns {Function} Function that takes optional route and returns computed home path
 * 
 * @example
 * const getHomePath = useHomePath();
 * const homePath = getHomePath(customRoute); // Returns computed ref to home path
 */
export const useHomePath = () => {
    const   route          = useRoute();
    const { locale }       = useI18n();
    const   isEn           = computed(()=> locale.value === 'en');

    /**
     * Generate home path for given route
     * @param {Object} [to] - Optional route object, defaults to current route
     * @param {string} to.path - Path of the route
     * @returns {ComputedRef<string>} Computed home path
     */
    return (to) =>{
        const  path = computed(()=> to?.path || route.path );
        
        return computed(()=> '/'+ (isEn.value? unref(path).split('/')[1]: unref(path).split('/')[2]));
    }
}

/**
 * Composable for fetching top-level menu items from CBD API
 * 
 * Provides a function that fetches and transforms menu data based on the current
 * route and locale. Includes error handling and debug logging for troubleshooting
 * useFetch issues.
 * 
 * @function useTopMenus
 * @param {Object} [to] - Optional route object, defaults to current route
 * @param {string} to.path - Path of the target route
 * @returns {Function} Async function that fetches menu data
 * 
 * @example
 * const fetchMenus = useTopMenus(route);
 * const { data, status, error, refresh } = await fetchMenus();
 * 
 * if (error.value) {
 *   console.error('Failed to load menus:', error.value);
 * } else {
 *   // Use menu data
 *   console.log('Menus loaded:', data.value);
 * }
 * 
 * @throws {Error} When API request fails or returns invalid data
 */
export const useTopMenus = (to) => {
    const { locale }       = useI18n();
    const   eventBus       = useEventBus();
    const   route          = useRoute();
    const   getCachedData  = useGetCachedData();
    const { cbdApi }       = useRuntimeConfig().public;
    const   isEn           = computed(()=> locale.value === 'en');
    const   path           = computed(()=> to?.path || route.path );
    const   key            = computed(()=>`top-menus-${path.value?.replace(/\//g, '-')}`);
    const   pathKey        = computed(()=> '/'+ (isEn.value? unref(path).split('/')[1]: unref(path).split('/')[2]));

    /**
     * Computed query object for MongoDB aggregation pipeline
     * @type {ComputedRef<Object>}
     */
    const query = computed(() => {
        const $size    = 3//isEn.value? 3 : 4;
        const $match   = {$or: [{ "adminTags" : { $all: ['ebsa-portal', unref(pathKey)], $size } }, { "adminTags" : { $all: ['ebsa-portal', unref(pathKey)], $size:$size-1 } }]};
        const $project = { _id:1, title:1, adminTags:1, customProperties:1,  };
        const $sort    = { 'customProperties.order': 1 };  
        const $limit   = 50;
        const ag       = JSON.stringify([{ $match }, { $project }, { $sort }, { $limit }]);
    
    
        return { ag };
    });
    
    /**
     * Async function that executes the menu fetch operation
     * 
     * @async
     * @function fetchMenuData
     * @returns {Promise<Object>} Object containing fetch results and utilities
     * @returns {Ref<Array>} returns.data - Transformed menu data array
     * @returns {Ref<string>} returns.status - HTTP status of the request
     * @returns {Ref<Error|null>} returns.error - Error object if request failed
     * @returns {Function} returns.refresh - Function to refresh the data
     * @returns {ComputedRef<string>} returns.pathKey - Current path key for debugging
     * 
     * @throws {Error} When API request fails or returns no data
     */
    return async ()=>{
        const { data, status, error, refresh } =  await useFetch(`${cbdApi}/api/v2017/articles`, {  method: 'GET', query, key:key.value, getCachedData, transform }); //key: 'hero-image', getCachedData

        // Debug logging for useFetch issues
        if (error.value) {
            console.error('[useTopMenus] useFetch error:', {
                error: error.value,
                status: status.value,
                url: `${cbdApi}/api/v2017/articles`,
                query: query.value,
                key: key.value,
                pathKey: pathKey.value
            });
        }

        if (!data.value || data.value.length === 0) {
            console.error('[useTopMenus] useFetch returned no data:', {
                data: data.value,
                status: status.value,
                url: `${cbdApi}/api/v2017/articles`,
                query: query.value,
                key: key.value,
                pathKey: pathKey.value
            });
        }

        // const menus = cleanMenus(data.value, locale, pathKey);
        return { data, status, error, refresh, pathKey };
    }
    
    /**
     * Transform function for menu data from API response
     * 
     * Converts raw API menu objects into standardized menu items with
     * localized titles and proper routing paths.
     * 
     * @function transform
     * @param {Array<Object>} data - Raw menu data from API
     * @param {string} data[].id - Menu item ID
     * @param {Object} data[].title - Title object with locale keys
     * @param {string[]} data[].adminTags - Admin tags for categorization
     * @param {Object} data[].customProperties - Custom properties including redirects
     * @returns {Array<Object>} Transformed menu items
     * @returns {string} returns[]._id - Menu item ID
     * @returns {string} returns[].title - Localized title
     * @returns {string} returns[].path - Navigation path
     * @returns {string} returns[].link - Same as path (for compatibility)
     */
    function transform(data){
        return data.map((aMenu)=>{

            const hasRedirect = aMenu.customProperties?.mainMenuRedirect;
            const title = getTitle(aMenu, locale);
            const path  = hasRedirect? hasRedirect : getPath(aMenu, pathKey);
            const link  = path
            return { _id:aMenu._id, title, path, link};
        });
    }
}

/**
 * Clean and transform menu data for rendering
 * 
 * Legacy function that transforms menu data. This function is kept for
 * backwards compatibility but is not currently used in the main flow.
 * 
 * @function cleanMenus
 * @param {Array<Object>} m - Array of raw menu objects
 * @param {Ref<string>} locale - Current locale reference
 * @param {ComputedRef<string>} parentPath - Parent path reference
 * @returns {Array<Object>} Cleaned menu objects
 * @returns {string} returns[].title - Localized menu title
 * @returns {string} returns[].path - Menu navigation path
 * @returns {string} returns[].link - Same as path (for compatibility)
 * 
 * @deprecated This function is kept for backwards compatibility
 * @example
 * const cleanedMenus = cleanMenus(rawMenus, locale, parentPath);
 */
export function cleanMenus(m, locale, parentPath){
    return m.map((aMenu)=>{
        const title = getTitle(aMenu, locale);
        const path  = getPath(aMenu, parentPath);
        const link  = path
        return { title, path, link};
    });
}

/**
 * Extract localized title from menu object
 * 
 * Gets the title in the current locale, falling back to English if
 * the current locale is not available.
 * 
 * @function getTitle
 * @param {Object} aMenu - Menu object with title property
 * @param {Object} aMenu.title - Title object with locale keys
 * @param {string} aMenu.title.en - English title (fallback)
 * @param {Ref<string>} locale - Current locale reference
 * @returns {string} Localized title string
 * 
 * @example
 * const title = getTitle(menuItem, locale);
 * // Returns: "About Us" (if locale is 'en') or "À propos" (if locale is 'fr')
 */
function getTitle(aMenu, locale){
    return aMenu?.title[unref(locale)] || aMenu?.title?.en;
}

/**
 * Generate navigation path from menu admin tags
 * 
 * Extracts the appropriate path segment from admin tags based on
 * the parent path and tag structure depth.
 * 
 * @function getPath
 * @param {Object} aMenu - Menu object with adminTags
 * @param {string[]} aMenu.adminTags - Array of admin tags for categorization
 * @param {ComputedRef<string>} parentPath - Parent path reference
 * @returns {string} Generated navigation path
 * 
 * @example
 * const path = getPath(menuItem, parentPath);
 * // Returns: "/ebsas/meetings" based on admin tags structure
 */
function getPath(aMenu, parentPath){
    const size = aMenu.adminTags.length;
    const tags = aMenu.adminTags.filter(tag=> size === 3? !['ebsa-portal', parentPath.value].includes(tag) : !['ebsa-portal'].includes(tag));
    const tag  = tags.find(tag=>tag.startsWith(parentPath.value));

    return tag;
}