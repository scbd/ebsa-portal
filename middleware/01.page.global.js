export default defineNuxtRouteMiddleware(async (to, from) => {
    const   nuxtApp        = useNuxtApp();
    const   eventBus        = useEventBus();
    const   getCachedData  = useGetCachedData();
    const { cbdApi }       = useRuntimeConfig().public;
    const   path           = computed(()=> to?.path );

    await   skipPath();
    const   locale         = nuxtApp.$i18n.locale;
    const   key            = computed(()=>`page-${locale.value}-${path.value?.replace(/\//g, '-')}`);

    const query = computed(() => {
                                    const $match   = { "adminTags" : { $all: ['ebsa-portal', removeLocaleFromPath(path.value) ]}};
                                    // const $addFields= { size: { $size: "$adminTags" }};
                                    // const $project = {title:1, summary:1, content:1, coverImage:1, customProperties:1, adminTags:1,  };
                                    const $sort    = { '_id': 1 };  
                                    const $limit   = 20;
                                    const ag       = JSON.stringify([{ $match },  { $sort }, { $limit }]);
                                
                                    return { ag };
                                });

    const { data, status, error, refresh } =  await useFetch(`${cbdApi}/api/v2017/articles`, {  method: 'GET', query, key:key.value, getCachedData, transform }); 

    const title      = computed(()=>  data.value?.title? data.value.title[locale.value] : '');
    const summary      = computed(()=>  data.value?.summary? data.value.summary[locale.value] : '');
    const coverImage = computed(()=>  data.value?.coverImage? data.value.coverImage.url : '');
    const content    = computed(()=>  data.value?.content? data.value.content[locale.value] : '');
    const _id        = computed(()=>  data.value? data.value._id : '');
    const crumb      = { ariaLabel: title.value, to: to.path, current: true };
    const customProperties =  data.value? data.value.customProperties: {};
    const adminTags =  data.value? data.value.adminTags : [];

    const page = { ...data.value, path:to.path, title:title.value, summary:summary.value, content:content.value, crumb};

    const p = useState('page', () => page);

    if(p.value.path !== page.path) p.value = page;

    eventBus.emit('page', page);

    function transform(data){
        const d =  data.map((a)=> ({...a, redirectTo: a?.customProperties?.redirectTo, adminTagsLength: a?.adminTags?.length || 0})).sort((a,b)=> sortArrayOfObjectsByProp(a,b, 'adminTagsLength', 'desc'));

        return d[0]
    }

    async function skipPath(){
        const skipPaths = ['/.well-known','/fonts.googleapis.com','/.well-known/appspecific'];

        for(let p of skipPaths)
            if(path?.value?.includes(p)) 
                return  abortNavigation(`/`);

    }

    function removeLocaleFromPath(path) {
        if (!path || typeof path !== 'string') return path;
    
        const localesToRemove = ['/ar', '/fr', '/ru', '/zh', '/es'];
        for (const locale of localesToRemove) {
            if (path.startsWith(locale)) {
                return path.slice(locale.length);
            }
        }
    
        return path;
    }
})