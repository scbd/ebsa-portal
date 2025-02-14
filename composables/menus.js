export const useMenuLevels = () => {
    const { locale }         = useI18n();
    const   route            = useRoute();
    const   isEn             = computed(()=> locale.value === 'en');
    const   routeArray       = computed(()=> route.path.split('/').filter(x=>x));
    const   isTopLevel       = computed(()=> unref(isEn)? routeArray.value?.length === 1 : routeArray.value?.length === 2);
    const   isSecondLevel    = computed(()=> unref(isEn)? routeArray.value?.length === 2 : routeArray.value?.length === 3);
    const   isThirdLevel     = computed(()=> unref(isEn)? routeArray.value?.length === 3 : routeArray.value?.length === 4);  

    const isFirstLevel = (aMenu) => isEn.value? aMenu.path.split('/').length === 2 : aMenu.path.split('/').length === 3;
    const firstLevel = (path) => isEn.value? `/`+path.split('/')[1]: `/`+path.split('/')[2];


    return { isTopLevel, isSecondLevel, isThirdLevel, routeArray, isEn, isFirstLevel, firstLevel };
}

export const useParentPath = () => {
    const   route    = useRoute();

    const hasParent  = computed(()=> !!getParentPath(route.path));
    const parentPath = computed(()=> getParentPath(route.path));

    return { parentPath, hasParent };
}

export const useHomePath = () => {
    const   route          = useRoute();
    const { locale }       = useI18n();
    const   isEn           = computed(()=> locale.value === 'en');

    return (to) =>{
        const  path = computed(()=> to?.path || route.path );
        
        return computed(()=> '/'+ (isEn.value? unref(path).split('/')[1]: unref(path).split('/')[2]));
    }
}

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
    return async ()=>{
        const { data, status, error, refresh } =  await useFetch(`${cbdApi}/api/v2017/articles`, {  method: 'GET', query, key:key.value, getCachedData, transform }); //key: 'hero-image', getCachedData

        // const menus = cleanMenus(data.value, locale, pathKey);
        return { data, status, error, refresh, pathKey };
    }
    function transform(data){
        return data.map((aMenu)=>{
            const title = getTitle(aMenu, locale);
            const path  = getPath(aMenu, pathKey);
            const link  = path
            return { _id:aMenu._id, title, path, link};
        });
    }
}


export function cleanMenus(m, locale, parentPath){
    return m.map((aMenu)=>{
        const title = getTitle(aMenu, locale);
        const path  = getPath(aMenu, parentPath);
        const link  = path
        return { title, path, link};
    });
}


function getTitle(aMenu, locale){
    return aMenu?.title[unref(locale)] || aMenu?.title?.en;
}

function getPath(aMenu, parentPath){
    const size = aMenu.adminTags.length;
    const tags = aMenu.adminTags.filter(tag=> size === 3? !['ebsa-portal', parentPath.value].includes(tag) : !['ebsa-portal'].includes(tag));
    const tag  = tags.find(tag=>tag.startsWith(parentPath.value));

    return tag;
}