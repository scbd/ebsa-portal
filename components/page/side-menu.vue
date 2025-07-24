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
const   parent         = ref(null);
const { locale }       = useI18n();
const   menus          = computed(()=>normalizeMenus(props.menus));

function normalizeMenus(menus){
    parent.value = menus[0]

    return menus.slice(1)
}

</script>
<style scoped>
li {
    width:100%;
}
</style>