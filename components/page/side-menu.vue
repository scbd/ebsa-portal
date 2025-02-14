<template>
    <ClientOnly>
        <div class="col-3 sidebar">
            <div class="bs-sidebar hidden-print">
                <h4>{{parent?.title}}</h4>

                <ul class="nav nav-tabs">
                    <li v-for="(aMenu, key) in menus" :key='key' :class="{active: aMenu.path === $route.path}" >
                        <PageEditButton :_id="aMenu._id" :hide-text="true"/>
                        
                        <NuxtLink :to="aMenu.path" class="nav-link" :class="{active: aMenu.path === $route.path}">{{aMenu.title}}</NuxtLink>
                        
                    </li>
                </ul>
            </div>
        </div>
    </ClientOnly>
</template>

<script setup>
const   props          = defineProps({ menus: { type: Array } });
const   parent         = useState('parent-page');
const { locale }       = useI18n();
// const { parentPath }   = useParentPath();
const   menus          = computed(()=>props.menus);


function cleanMenus(){
    return props.menus.map((aMenu)=>{
        const title = getTitle(aMenu);
        const path  = getPath(aMenu);

        return { title, path };
    });
}


// function getTitle(aMenu){
//     return aMenu?.title[locale.value] || aMenu?.title?.en;
// }

// function getPath(aMenu){

//     const tags = aMenu.adminTags.filter(tag=>!['ebsa-portal', parentPath.value].includes(tag));
//     const tag  = tags.find(tag=>tag.startsWith(parentPath.value));

//     return tag;
// }
</script>
<style scoped>
li {
    width:100%;
}
</style>