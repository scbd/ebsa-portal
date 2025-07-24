<template>
    <div class="row my-3">
        <PageSideMenu v-if="hasSideMenu" :menus="data"/>

        <div class="px-0" :class="{'col-12': !hasSideMenu, 'col-9': hasSideMenu}">
            <PageComponentAbove/>
            <PageEditButton :_id="_id" />
            <div v-show="!isGmapTitleAsPageBody" class="ck-content px-0">
                <div ref="contentEl" v-html="htmlSanitize(content)"></div>
            </div>
            <PageComponentBelow/>
        </div>
    </div>
</template>

<script setup>

const {  hasParent  } = useParentPath (); 
const localizeRecord = useLocalizeRecord ();
const page = useState('page');
const { locale, t }       = useI18n();
const   route          = useRoute();
const   getCachedData  = useGetCachedData();
const { cbdApi, oasisApi }       = useRuntimeConfig().public;
const { isThirdLevel } = useMenuLevels();
const contentEl = ref();
const _id                   = computed(()=>page.value?._id);
const isGmapTitleAsPageBody = useIsGmapTitleAsPageBody();
const content               = computed(()=>page.value?.content);

const parentPathSearch = computed(()=>getParentPath(route.path));
const key              = computed(()=>`page-side-menu-${route.path}-${locale.value}`);
const redirectTo       = computed(()=>page.value?.customProperties?.redirectTo);


onMounted(()=>preProcessOEmbed());
const query = computed(() => {
    const $match   = { "adminTags" : { $all: ['ebsa-portal', `${parentPathSearch.value}`] }, $or: [ { adminTags: { $size: 3 } }, { adminTags: { $size: 4 } } ]};
    const $project = { title:1, adminTags:1, customProperties:1 };
    const $sort    = { 'customProperties.order': 1 };  
    const $limit   = 50;
    const ag       = JSON.stringify([{$match}, {$project}, {$sort}, {$limit}]);// {$project},

    return { ag };
});



const { data, status, error, refresh } =  await useFetch(`${cbdApi}/api/v2017/articles`, {  method: 'GET', query, key:key.value, getCachedData, transform }); //key: 'hero-image', getCachedData


const hasSideMenu = computed(()=> hasParent.value && isThirdLevel.value && data.value?.length > 0);


function transform(data){
    return  data.map((a)=>localizeRecord (a))
                    .map((a)=> ({...a, redirectTo: a?.customProperties?.redirectTo, adminTagsLength: a?.adminTags?.length || 0}))
                    .sort((a,b)=> sortArrayOfObjectsByProp(a,b, 'adminTagsLength', 'desc'));


}

watch(() => route.path, async (newVal, oldVal) => { await refresh(); });


if(redirectTo.value)  await navigateTo(redirectTo.value, { redirectCode: 301 });

function preProcessOEmbed() {
    const pattern = /src="https:\/\/www.youtube.com\/embed\/([^?]+)\?feature=oembed"/;


    contentEl.value.querySelectorAll( 'oembed[url]' ).forEach(async function(element) {
    const url = element.attributes.url.value;
    const  params = { url }

    const response = await $fetch(`${cbdApi}/api/v2020/oembed`, { params });  
    
    const title = response.title;
    const matches = response.html.match(pattern);
    const match = matches? matches[1] : null;
    const embedHtml = `<iframe class="youtube-video" src="https://www.youtube.com/embed/${match}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`


    element.insertAdjacentHTML("afterend", embedHtml);
    
});
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
    overflow: hidden
}
.fill img {
    flex-shrink: 0;
    min-width: 100%;
    min-height: 100%
}

</style>