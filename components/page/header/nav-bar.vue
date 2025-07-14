<template>
    <div class="wrapper menu-bg ">
        <div class="container">
                <div class="d-flex justify-content-between">
                    <div v-for="item in menus" class="nav-link d-flex align-items-center">
                        
                        <NuxtLink :to="localePath(item.path)"  class="me-1 menu-link fw-bolder text-center text-decoration-none" :class="{ 'active': isActive(item) }" exact-active-class="active" active-class="active">
                            {{item.title}}
                        </NuxtLink>
                        
                        <PageEditButton :_id="item._id" :hide-text="true" />
                        
                    </div>
                </div>
        </div>
    </div>
</template>

<script setup>
const route       = useRoute();
const router      = useRouter();
const localePath  = useLocalePath();
const getTopMenus = useTopMenus (route);

const { isFirstLevel, firstLevel } = useMenuLevels();

const isActive = (aMenu) => isFirstLevel(aMenu)? [aMenu.path, aMenu.link].includes(route.path) : route.path.startsWith(aMenu.path) || route.path.startsWith(aMenu.link);

const { data:menus, status, error, refresh } = await getTopMenus();

watch( () => route.path, async (to, from) => {  

    if(firstLevel(to) !== firstLevel(from))
        await refresh(); 
})
</script>

<style scoped>
    .nav-link {
        font-size: 16px;
        color: #999;
        padding: 10px 15px;
        font-family: 'Source Sans Pro', Helvetica, sans-serif;
        font-weight: 400;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.25);
    
        line-height: 20px;
        transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .menu-link:hover{
        color: #3c80a6;

    }
</style>
