<template>
    <div class="col-12 fill " v-if="coverImage">
        <NuxtImg format="webp" :src="coverImage"  :alt="summary || title"/>
        <div class="w-100 position-absolute">
            <div class="container">
                <div class="header">
                    <h1>{{ title}}</h1>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>

const { locale }       = useI18n();
const   route          = useRoute();
const   parent         = useState('parent-page');
const   page           = useState('page');
const   getCachedData  = useGetCachedData();
const localizeRecord = useLocalizeRecord ();
const { cbdApi }       = useRuntimeConfig().public;

const { isTopLevel, isSecondLevel, routeArray } = useMenuLevels();

const pathKey          = computed(()=> routeArray.value?.slice(0, routeArray.value.length-1).join('/'));
const key              = `hero-image-${pathKey.value}`;
const $size            = computed(()=> isTopLevel.value? 1 : isSecondLevel.value? 2 : 3);

const query = computed(() => {
    
    const $match   = { "adminTags" : { $all: ['ebsa-portal', `/${pathKey.value}`],  $size:$size.value }};
    const $project = { title:1, coverImage:1, summary:1, adminTags:1};
    const $sort    = { 'meta.updatedOn': -1 };  
    const $limit   = 1;
    const ag       = JSON.stringify([{$match}, {$project}, {$sort}, {$limit}]);

    return { ag };
});



const { data, status, error, refresh } =  await useFetch(`${cbdApi}/api/v2017/articles`, {  method: 'GET', query, key, getCachedData, transform }); //key: 'hero-image', getCachedData



const overRideParentText = computed(()=>page.value?.customProperties?.overRideHeader);



const queryParentExists = computed(()=>data.value);
const pageTitle        = computed(()=> page.value?.title);
const pageSummery        = computed(()=> page.value?.summary);
const defaultTitle     = computed(()=> queryParentExists.value? data.value.title : pageTitle.value);

const title      = computed(()=> overRideParentText.value? pageSummery.value || pageTitle.value : defaultTitle.value);



const summary          = computed(()=> queryParentExists.value? data.value?.summary : page.value?.summary? page.value?.summary[locale.value]:'');
const coverImage       = computed(()=> page?.value?.coverImage?.url ? page.value.coverImage.url : data.value?.coverImage );

parent.value = { summary:summary.value, title: title.value, coverImage: coverImage.value, path:`/${pathKey.value}` };
watch(() => route.path, async (to, from) => {  
    await refresh(); 
})

function transform(data){
    return data[0]? localizeRecord(data[0]) : '';
}
</script>

<style scoped>
h1{
    color:aliceblue;
    font-size: 42px;
    text-transform: uppercase;
}
.fill {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    max-height: 200px;
}
.fill img {
    flex-shrink: 0;
    min-width: 100%;
    min-height: 100%
}
</style>