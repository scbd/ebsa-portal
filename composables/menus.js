/**
 * Menu utilities and composables for EBSA portal navigation
 * Exports: useMenuLevels, useParentPath, useHomePath, useTopMenus, cleanMenus
 */

/**
 * Composable for determining menu navigation levels based on current route
 * @returns {Object} Navigation level utilities and computed properties
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
     * Checks if a menu item is at the first level of navigation
     * @param {Object} aMenu - Menu item object with path property
     * @returns {boolean} True if menu is at first level
     */
    const isFirstLevel = (aMenu) => isEn.value? aMenu.path.split('/').length === 2 : aMenu.path.split('/').length === 3;
    
    /**
     * Extracts the first level path from a given path
     * @param {string} path - Full path string
     * @returns {string} First level path
     */
    const firstLevel = (path) => isEn.value? `/`+path.split('/')[1]: `/`+path.split('/')[2];


    return { isTopLevel, isSecondLevel, isThirdLevel, routeArray, isEn, isFirstLevel, firstLevel };
}

/**
 * Composable for getting parent path information for the current route
 * @returns {Object} Parent path utilities and computed properties
 */
export const useParentPath = () => {
    const   route    = useRoute();

    const hasParent  = computed(()=> !!getParentPath(route.path));
    const parentPath = computed(()=> getParentPath(route.path));

    return { parentPath, hasParent };
}

/**
 * Composable for getting home path based on current route and locale
 * @returns {Function} Function that takes a route object and returns computed home path
 */
export const useHomePath = () => {
    const   route          = useRoute();
    const { locale }       = useI18n();
    const   isEn           = computed(()=> locale.value === 'en');

    return (to) =>{
        const  path = computed(()=> to?.path || route.path );
        
        return computed(()=> '/'+ (isEn.value? unref(path).split('/')[1]: unref(path).split('/')[2]));
    }
}

/**
 * Composable for fetching and managing top-level menu items
 * @param {Object} to - Optional route object to determine path context
 * @returns {Function} Async function that returns object with data, status, error, refresh, and pathKey
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


    const query = computed(() => {
        const $size    = 3//isEn.value? 3 : 4;
        const $match   = {$or: [{ "adminTags" : { $all: ['ebsa-portal', unref(pathKey)], $size } }, { "adminTags" : { $all: ['ebsa-portal', unref(pathKey)], $size:$size-1 } }]};
        const $project = { _id:1, title:1, adminTags:1, customProperties:1,  };
        const $sort    = { 'customProperties.order': 1 };  
        const $limit   = 50;
        const ag       = JSON.stringify([{ $match }, { $project }, { $sort }, { $limit }]);
    
        return { ag };
    });

    const request  =  useLazyFetch(`${cbdApi}/api/v2017/articles`, {  method: 'GET', query, key:key.value, getCachedData, transform }); //key: 'hero-image', getCachedData

    return async ()=>{
        const { data, status, error, refresh } = await request;

        return { data, status, error, refresh, pathKey };
    }
    /**
     * Transforms raw menu data from API into structured menu items with sorting
     * @param {Array} rawMenuData - Raw menu data from the API
     * @returns {Array} Transformed and sorted menu items
     */
    function transform(rawMenuData){
        return rawMenuData.map((aMenu)=>{
            const hasRedirect = aMenu.customProperties?.mainMenuRedirect;
            const title = getTitle(aMenu, locale);
            const path  = hasRedirect? hasRedirect : getPath(aMenu, pathKey);
            const link  = path;
            const order = Number(aMenu.customProperties?.order) || 0;
            
            return { _id:aMenu._id, title, path, link, order};
        }).sort((a, b) => a.order - b.order);
    }
}


/**
 * Cleans and transforms menu data into a simplified format
 * @param {Array} rawMenus - Array of raw menu items
 * @param {string} locale - Current locale string
 * @param {string} parentPath - Parent path for menu context
 * @returns {Array} Array of cleaned menu items with title, path, and link
 */

export function cleanMenus(rawMenus, locale, parentPath){
    return rawMenus.map((aMenu)=>{
        const title = getTitle(aMenu, locale);
        const path  = getPath(aMenu, parentPath);
        const link  = path
        return { title, path, link};
    });
}


/**
 * Extracts the localized title from a menu item
 * @param {Object} aMenu - Menu item object with title property
 * @param {string} locale - Current locale string
 * @returns {string} Localized title or English fallback
 */
function getTitle(aMenu, locale){
    return aMenu?.title[unref(locale)] || aMenu?.title?.en;
}

/**
 * Extracts the appropriate path from a menu item based on its admin tags
 * @param {Object} aMenu - Menu item object with adminTags property
 * @param {Object} parentPath - Parent path object with value property
 * @returns {string} Extracted path string
 */
function getPath(aMenu, parentPath){
    const size = aMenu.adminTags.length;
    const tags = aMenu.adminTags.filter(tag=> size === 3? !['ebsa-portal', parentPath.value].includes(tag) : !['ebsa-portal'].includes(tag));
    const tag  = tags.find(tag=>tag.startsWith(parentPath.value));

    return tag;
}