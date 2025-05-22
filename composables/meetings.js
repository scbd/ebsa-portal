

export const useMeetings = () => {

    const { locale }       = useI18n();
    // const { getCountries } = useCountries();
    const { cbdApi }       = useRuntimeConfig().public;
    const   getCachedData  = useGetCachedData();
    // const  allCountries   =  ref([]);

    return async (start=0, perPage=25, country, year, options)=>{
        // allCountries.value = await getCountries();

        const   key  = computed(()  =>`ebsa-meetings-${unref(start)}-${locale.value}-${options?.value}`);

        const query  = computed( () =>  {
            const prevQ    = options?.value === 'past'?   ` AND startDate_dt:[* TO NOW]`: '';
            const futureQ  = options?.value === 'future'? ` AND startDate_dt:[NOW TO *]`: '';
            const yearQ    = year.value?      ` AND startDate_dt:[${year.value.identifier}-01-01T00:00:00Z TO ${year.value.identifier}-12-31T23:59:59Z]`: prevQ || futureQ || '';
            const countryQ = country.value?   ` AND eventCountry_s:${country.value.identifier}`: '';

            return ({
                                        q       : `realm_ss:CHM AND schema_s:meeting AND symbol_s:*EBSA*${yearQ}${countryQ} AND NOT version_s:*`,
                                        fl      : `symbol_s,title_t, title_${locale.value.toLocaleUpperCase()}_t, eventCity_t, eventCity_${locale.value.toLocaleUpperCase()}_t, eventCountry_s, eventCountry_t, eventCountry_${locale.value.toLocaleUpperCase()}_s, status_s, startDate_dt, endDate_dt, identifier_s, url_ss,  description_t, description_${locale.value.toLocaleUpperCase()}_t,eventCity_${locale.value.toLocaleUpperCase()}_t`,
                                        "sort"  : "startDate_dt desc",
                                        "start" : unref(start)?unref(start)*unref(perPage):0,
                                        "rows"  : unref(perPage)
                                    
                                    })});

        const { data, status, error, refresh } =  await useFetch(`${cbdApi}/api/v2013/index`, {  method: 'GET', query, key:key.value, getCachedData, transform }); 

    
        return { data, status, error, refresh };
    }  

    function transform(data){
        const meetings    = data.response.docs.map(normalizeRecord);
        const meetingsMap = mapMeetings(meetings);

        return { meetingsMap , meetings, total: data?.response?.numFound };
    }

    function normalizeRecord(m){

        const startDate = new Date(m.startDate_dt);
        const endDate   = new Date(m.endDate_dt);
        
        const { symbol_s, eventCountry_s } = m;

        const isTranslated = m.title_t !== m[`title_${locale.value.toLocaleUpperCase()}_t`];
        const title        = m[`title_${locale.value.toLocaleUpperCase()}_t`];
        const country      = m[`eventCountry_${locale.value.toLocaleUpperCase()}_s`];
        const city         = m[`eventCity_${locale.value.toLocaleUpperCase()}_t`];
        const countryCode  = eventCountry_s?.toUpperCase();
        const documentsUrl = `http://www.cbd.int/doc/?meeting=${symbol_s}`

        return {    ...m,
                    country, title,startDate, endDate, documentsUrl, city, countryCode,isTranslated,
                    startMonth : startDate.getUTCMonth(),
                    endMonth   : endDate.getUTCMonth(),
                    startDay   : startDate.getUTCDate(),
                    endDay     : endDate.getUTCDate(),
                    startYear  : startDate.getUTCFullYear(),
                    endYear    : endDate.getUTCFullYear(),
                    countryCode: eventCountry_s?.toUpperCase()
                }
    }

    function mapMeetings(meetings){
        const meetingMaps=[];
        const meetingMap = {};

        for(const meeting of meetings){
            const { startYear } = meeting;

            if(!meetingMap[startYear]) meetingMap[startYear] = { index: startYear, months: {}, meetings: [] };

            meetingMap[startYear].meetings.push(meeting);
            // meetingMap[startYear].meetings = meetingMap[startYear].meetings.sort((a,b)=>a.startMonth-b.startMonth);
        }

        for(const year in meetingMap){
            for(const meeting of meetingMap[year].meetings){
                
                const { startMonth } = meeting;
                const   monthMap     = meetingMap[year].months;

                if(!monthMap[startMonth]) monthMap[startMonth] = { index: startMonth, meetings: [] };

                monthMap[startMonth]?.meetings?.push(meeting);
                monthMap[startMonth].meetings = monthMap[startMonth]?.meetings?.sort((a,b)=>a.startDay-b.startDay);
            }
        }

        for(const year in meetingMap){
            meetingMap[year].months = Object.entries(meetingMap[year].months).sort((a,b)=>a[0]-b[0]);

        }
        return Object.entries(meetingMap).sort((a,b)=>b[0]-a[0]);
    }


}

export const useMeetingFilters = () => {

    const { locale }       = useI18n();
    const { getCountries } = useCountries();
    const { cbdApi }       = useRuntimeConfig().public;
    const   getCachedData  = useGetCachedData();
    const  allCountries    =  ref([]);

    return async ()=>{
        allCountries.value = (await getCountries()).data.value;

        const   key  = computed(()  =>`ebsa-meetings-filters-${locale.value}`);
        const query  = computed( () =>  ({
                                        "q"     : "realm_ss:CHM AND schema_s:meeting AND symbol_s:*EBSA* AND NOT version_s:*",
                                        fl      : `symbol_s,title_t, title_${locale.value.toLocaleUpperCase()}_t, eventCity_t, eventCity_${locale.value.toLocaleUpperCase()}_t, eventCountry_s, eventCountry_t, eventCountry_${locale.value.toLocaleUpperCase()}_s, status_s, startDate_dt, endDate_dt, identifier_s, url_ss,  description_t, description_${locale.value.toLocaleUpperCase()}_t,eventCity_${locale.value.toLocaleUpperCase()}_t`,
                                        "sort"  : "startDate_dt desc",
                                        "start" : 0,
                                        "rows"  : 99999
                                    }));

        const { data, status, error, refresh } =  await useFetch(`${cbdApi}/api/v2013/index`, {  method: 'GET', query, key:key.value, getCachedData, transform }); 

        return { data, status, error, refresh };
    }  

    function transform(data){
        const meetings    = data.response.docs.map(normalizeRecord);
        const filters     = getFilters(meetings);

        return filters;
    }

    function normalizeRecord(m){

        const startDate = new Date(m.startDate_dt);
        const endDate   = new Date(m.endDate_dt);
        
        const { symbol_s, eventCountry_s } = m;

        const isTranslated = m.title_t !== m[`title_${locale.value.toLocaleUpperCase()}_t`];
        const title        = m[`title_${locale.value.toLocaleUpperCase()}_t`];
        const country      = m[`eventCountry_${locale.value.toLocaleUpperCase()}_s`];
        const city         = m[`eventCity_${locale.value.toLocaleUpperCase()}_t`];
        const countryCode  = eventCountry_s?.toUpperCase();
        const documentsUrl = `http://www.cbd.int/doc/?meeting=${symbol_s}`

        return {    ...m,
                    country, title,startDate, endDate, documentsUrl, city, countryCode,isTranslated,
                    startMonth : startDate.getUTCMonth(),
                    endMonth   : endDate.getUTCMonth(),
                    startDay   : startDate.getUTCDate(),
                    endDay     : endDate.getUTCDate(),
                    startYear  : startDate.getUTCFullYear(),
                    endYear    : endDate.getUTCFullYear(),
                    countryCode: eventCountry_s
                }
    }



    function getFilters(meetings){

        const allYears    = [];
        const pastYears   = [];
        const futureYears = [];
        const countries   = [];
        const filters     = { allYears: [], pastYears: [], futureYears:[], countries:[] };

        for(const m of meetings){
            const { startYear } = m;

            if(!allYears.includes(startYear)) allYears.push(startYear);
            if(startYear < new Date().getUTCFullYear() && !pastYears.includes(startYear)) pastYears.push(startYear);
            if(startYear >= new Date().getUTCFullYear() && !futureYears.includes(startYear)) futureYears.push(startYear);
            if(!countries.includes(m.country)) countries.push(m.countryCode);
        }

        filters.allYears = allYears.map(yearFilterMap).sort((a,b)=>b.identifier-a.identifier);
        filters.pastYears = pastYears.map(yearFilterMap).sort((a,b)=>b.identifier-a.identifier);
        filters.futureYears = futureYears.map(yearFilterMap).sort((a,b)=>b.identifier-a.identifier);

        filters.countries = allCountries.value.filter(c=>countries.filter(Boolean).includes(c.identifier))//.sort((a,b)=>a.title.localeCompare(b.title));

        return filters;
    }

    function yearFilterMap(year){

        return { identifier: year, title: year }
    }
}