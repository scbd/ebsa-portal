import mitt from 'mitt'   
import clone from 'lodash.clonedeep'
// Create a new event bus using mitt
const eventBus = mitt();

export const useEventBus = () => eventBus;

export const useGetCachedData= () =>  {
    const nuxtApp    = useNuxtApp();
    
    return (key) => { 
        return nuxtApp?.payload?.data[key] || nuxtApp?.static?.data[key];
    }
}

export const useLocalizeRecord = () => {
    

    const { locale } = useI18n();

    return (passedRecord) => {
        const record = clone(unref(passedRecord));

        if(passedRecord.title)      record.title      = passedRecord.title[locale.value];
        if(passedRecord.summary)    record.summary    = passedRecord.summary[locale.value];
        if(passedRecord.content)    record.content    = passedRecord.content[locale.value];
        if(passedRecord.coverImage) record.coverImage = passedRecord.coverImage.url;
        if(passedRecord.description) record.description = passedRecord.description[locale.value];
        if(passedRecord.eventCountry_t) record.eventCountry = passedRecord[`eventCountry_${locale.value.toLocaleUpperCase()}_t`];
        if(passedRecord.eventCity_t) record.eventCity = passedRecord[`eventCity_${locale.value.toLocaleUpperCase()}_t`];
        if(passedRecord.title_t) record.title = passedRecord[`title_${locale.value.toLocaleUpperCase()}_t`];
        if(passedRecord.description_t) record.description = passedRecord[`description_${locale.value.toLocaleUpperCase()}_t`];
        
        record.path = getPath(record.adminTags);
        return record;
    }
}
export const useIsmDocuments = () => {
    return ref([])
}
export const useIsmDocumentsArchived = () => {
    return ref([])
}
export const useIsmShapes = () => {
    return ref([])
}
export const useEbsaDocuments = () => {
    const { locale, t }     = useI18n();
    const getRegionsRequest = useEbsaRegions()();
    const { cbdApi }        = useRuntimeConfig().public;
    const   getCachedData   = useGetCachedData();
    const   key             = computed(()=>`ebsa-documents`);

    const query = computed(() => ({
                                        "q"  : "realm_ss:CHM AND schema_s:marineEbsa AND NOT version_s:*",
                                        "fl" : `createdDate_dt,identifier_s,url_ss,region_s,title_t,title_${locale.value.toLocaleUpperCase()}_t,description_${locale.value.toLocaleUpperCase()}_t`,
                                        "sort"  : "updatedDate_dt desc",
                                        "start" : 0,
                                        "rows"  : 999999,
                                    }));


    return async ()=>{
        try{
            const { data, status, error, refresh } =  await useFetch(`https://api.cbd.int/api/v2013/index`, {  method: 'GET', query, key:key.value, getCachedData,transform });

            if(error.value) return { data:ref([]), status, error, refresh };

            return { data, status, error, refresh };
        }catch(e){


            return { data:ref([]), status:ref('error'), error:ref(e), refresh:ref(()=>{}) };
        }
    }

    function transform(resp){
        const isEn       = locale.value === 'en';
        const records    = resp.response.docs;
        const newRecords =  [];

        for (const r of records) {
            const needsI18n = isEn.value? false : r.title_t === r[`title_${locale.value.toLocaleUpperCase()}_t`];
            
            const year = extractFirstFourChars(r.createdDate_dt);
            const url = r.url_ss[0];
            const title = r[`title_${locale.value.toLocaleUpperCase()}_t`] || r.title_t;
            const region = r.region_s;

            newRecords.push({ url, title, region, year }); 
        }

        
        return newRecords;
    }
}
function extractFirstFourChars(str) {
    if (!str || typeof str !== 'string') return '';
    return Number(str.substring(0, 4));
}
export const usePageData = (to) => {
    const { locale }       = useI18n();
    const   eventBus       = useEventBus();
    const   route          = useRoute();
    const   getCachedData  = useGetCachedData();
    const { cbdApi }       = useRuntimeConfig().public;
    const   path           = computed(()=> to?.path || route.path );
    const   key            = computed(()=>`page${path.value?.replace(/\//g, '-')}`);

    const query = computed(() => {
        const $match   = { "adminTags" : { $all: ['ebsa-portal', path.value ]}};
        const $project = { title:1, content:1, coverImage:1, customProperties:1};
        const $sort    = { 'meta.updatedOn': -1 };  
        const $limit   = 1;
        const ag       = JSON.stringify([{ $match }, { $project }, { $sort }, { $limit }]);
    
        return { ag };
    });
    return async ()=>{
        const { data, status, error, refresh } =  await useFetch(`${cbdApi}/api/v2017/articles`, {  method: 'GET', query, key:key.value, getCachedData }); //key: 'hero-image', getCachedData

        const title      = computed(()=> data.value?.length && data.value[0]?.title? data.value[0].title[locale.value] : '');
        const coverImage = computed(()=> data.value?.length && data.value[0]?.coverImage? data.value[0].coverImage.url : '');
        const content    = computed(()=> data.value?.length && data.value[0]?.content? data.value[0].content[locale.value] : '');

        const crumb = { ariaLabel: title.value, to: route.path, current: true };

        // eventBus.emit('page-title', crumb);
        eventBus.emit('page-cover-image', coverImage.value);

        return { title, coverImage, content, status, error, refresh };
    }
}

export const useShapes = (isArchive=false) => {
    const { locale }       = useI18n();
    const   getRegionsRequest = useEbsaRegions()();
    const { cbdApi }       = useRuntimeConfig().public;
    const   getCachedData  = useGetCachedData();
    const   key            = computed(()=>`ebsa-shapes-${isArchive}`);


    const query =
                        {
                            "q"  : "realm_ss:CHM AND schema_s:marineEbsa AND NOT version_s:*",
                            "fl" : `createdDate_dt,identifier_s,url_ss,region_s,title_t,title_${locale.value.toLocaleUpperCase()}_t,description_${locale.value.toLocaleUpperCase()}_t,shapeUrl_ss,simplifiedShape_txt`,
                            "sort"  : "updatedDate_dt desc",
                            "start" : 0,
                            "rows"  : 999999,
                        };
    return async ()=>{
        const { data, status, error, refresh } =  await useFetch(`${cbdApi}/api/v2013/index`, {  method: 'GET', query, key:key.value, getCachedData,transform }); 


        return { data, status, error, refresh };
    }

    async function transform(resp){
            const records = resp.response.docs;

    
            const regions = (await getRegionsRequest).data.value;
            return records.map(r => {

                const region = regions.find(region => region.identifier === r.region_s) || { identifier : r.region_s, title : { en : "" } };


                r.simplifiedShape_txt=r.simplifiedShape_txt.map((s)=>JSON.parse(s));
                r.features = (r.simplifiedShape_txt.map((s)=>s.features)).flat();

                const i18n = tryI18n(r)
                if(!r.features?.length) delete r.features;

                r.title_t = r[`title_${locale.value.toUpperCase()}_t`];
                r.description_t = r[`description_${locale.value.toUpperCase()}_t`];
                
                if(r.features?.length)
                r.features = r.features.map(f => {

                    f.properties = f.properties || {};
                    f.properties.style =  {
                        strokeColor: isArchive? "#ff0000": "#FFFFFF",
                        fillColor  : isArchive? "#ff0000": "#FFFFFF",
                    };
           
                    if(isArchive) f.properties.archive = true;
                    if(i18n) f.properties.tryI18n = true;

                    f.properties.__record = {
                        identifier   : r.identifier_s,
                        url         : r.url_ss[0],
                        title       : r.title_t ,
                        description : r.description_t,
                        region      : {
                            identifier : region.identifier,
                            title : region.title
                        }
                    };
                    if(isArchive) f.properties.__record.archive = true;
                    if(i18n) f.properties.__record.tryI18n = true;
                    return f
                });

                return r;
            })

            function tryI18n(record){
                if(locale.value === 'en') return false;

                if(record.title_t === record[`title_${locale.value.toLocaleUpperCase()}_t`]) return true;

                return false;
            }
    }
}

export const useEbsaRegions = () => {
    const { locale }       = useI18n();
    const { cbdApi }       = useRuntimeConfig().public;
    const   getCachedData  = useGetCachedData();
    const   key            = computed(()=>`ebsa-regions`);

    return async ()=>{
        const { data, status, error, refresh } =  await useFetch(`${cbdApi}/api/v2013/thesaurus/domains/0AE91664-5C43-46FB-9959-0744AD1B0E91/terms`, {  method: 'GET', key:key.value, getCachedData, transform }); 

        return { data, status, error, refresh };
    }

    function transform(data){

        return data.map(item => {
            return {
                identifier: item.identifier,
                title: item.title[locale.value]
            }
        }).sort((a,b)=> sortArrayOfObjectsByProp(a,b, 'title', 'desc'));
    }
}

export const useEbsaCops = () => {
    const { locale, t }       = useI18n();
    const { cbdApi }       = useRuntimeConfig().public;
    const   getCachedData  = useGetCachedData();
    const   key            = computed(()=>`ebsa-regions`);

    const cops = [
        { index: 0, title: t('cop-15-long'), identifier : ['21B2B800-3F1C-4751-B054-A7430370ACFF']},
        {  index: 1, title: t('cop-14-long'), identifier : ['4B547476-0A24-4CED-9A35-B4EE9C53EA31','550938E7-3A09-436C-9A39-CD54277BDDDC']},
        {  index: 2, title: t('cop-13-long'), identifier : ['A2AFD051-BE56-4EB6-880B-204A647C876E','D9AE82B7-6033-4EBE-9A7D-88A115AEF6FE','C540FD85-87E1-4CAC-A37B-27A252A02012']},
        {  index: 3, title: t('cop-12-long'), identifier : ['800F52F9-E7A7-47F2-94E4-EA34F60A13A1', '41778E79-EC55-4717-B500-165999F07D74', '81893F06-7D2D-43FE-B13B-098C335C9A3B', '16EA9FE2-323D-40EB-ACF0-EEB3C164F107','48C4C187-A6A6-4F36-9024-DE73E2BB0721','3CD91D7F-785A-4F87-BD8C-8CC7B837DE59','B23DF27C-4E0C-481F-90DE-0120B095AB29']},
        {  index: 4, title: t('cop-11-long'), identifier :['CA3259CC-2FA6-4E8C-8560-967DB05C5D48','B58E1174-BA60-481A-83EA-CD0310DCFCFD']},
    ]
    return async ()=>{
        return cops.sort((a,b)=> sortArrayOfObjectsByProp(a,b, 'index', 'desc'));
    }
 
}


export const useIsmYearFilter = () => {
    const { cbdApi }       = useRuntimeConfig().public;
    const   getCachedData  = useGetCachedData();
    const   key            = computed(()=>`ebsa-years`);


    const query = computed(() => ({
                            "q"  : "realm_ss:CHM AND schema_s:marineEbsa AND NOT version_s:*",
                            "fl" : `createdDate_dt`,
                            "sort"  : "updatedDate_dt desc",
                            "start" : 0,
                            "rows"  : 999999,
                        }));


    return async ()=>{
        const { data, status, error, refresh } =  await useFetch(`${cbdApi}/api/v2013/index`, {  method: 'GET', query, key:key.value, getCachedData,transform });

        return { data, status, error, refresh };
    }

    function transform(resp){
        const records  = resp.response.docs;
        const years    = Array.from(new Set (records.map(r => Number(extractFirstFourChars(r.createdDate_dt)))));
        const filter   = years.sort().map(year => ({ title: year, identifier: year }));

        return filter;
    }
}

const countriesCache = {};
export const useCountries = () => {
    const { locale }       = useI18n();
    const { cbdApi }       = useRuntimeConfig().public;
    const   getCachedData  = useGetCachedData();
    const   key            = computed(()=>`countries-${locale.value}`);

    const getCountries = async ()=>{
       // if(countriesCache[locale.value]) return countriesCache[locale.value];

        const { data, status, error, refresh } =  await useFetch(`${cbdApi}/api/v2013/countries`, {  method: 'GET', key:key.value, getCachedData, transform }); 

        countriesCache[locale.value] = { data, status, error, refresh };
        return { data, status, error, refresh };
    }

    return { getCountries };
 

    function transform(data){

        return data.map(item => {
            return {
                identifier: item?.code?.toLowerCase(),
                name      : item.name[locale.value]
            }
        }).sort((a,b)=> sortArrayOfObjectsByProp(a,b, 'title', 'asc'));
    }
}

export function useIsGmapTitleAsPageBody(){
    const page = useState('page');


    const returnContextedFunction = () => {
        const customProperties = Object.entries(page.value?.customProperties || {});
        
        if(!customProperties?.length) return false
    
        for (const [key, value] of customProperties)
            if(key.startsWith('gmapTitleAsPageBody'))
                return true;

        return false;
    }

    return computed(returnContextedFunction);
}

export function useGetPageBody(){
    const page = useState('page');

    return computed(()=>page.value?.content);
}
