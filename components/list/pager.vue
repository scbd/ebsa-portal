<template>
    <nav  aria-label="pagination">
        <ul class="pagination">
            <li @click="goTo(options.page-1)" class="page-item " :class="{ disabled: options.page === 0 }">
                <a class="page-link" href="#" tabindex="-1" aria-disabled="true">{{t('Previous')  }}</a>
            </li>
            <li @click="goTo(page-1)" v-for="page in pagesSlice" class="page-item" :class="{ active: page-1 === options.page }">
                <a class="page-link" href="#">{{page}}</a>
            </li>
            <li @click="goTo(options.page+1)" class="page-item" :class="{ disabled: options.page === totalPages-1 }">
                <a class="page-link" href="#">{{t('Next')  }}</a>
            </li>
        </ul>
    </nav>
</template>

<script setup>
const   props        = defineProps({ options : { type: Object, default: () => ({ total:0, page:0, perPage:5 })} });
const { options }    = toRefs(props);
const { t }          = useI18n();
const   eventBus     = useEventBus();

const totalPages     = computed(()=>Math.ceil(options.value.total/options.value.perPage));
const pages          = computed(()=>Array.from({length: totalPages.value}, (_, i) => i + 1));
const pagesSlice     = computed(getPagesSlice);

function goTo(page){
    if(page < 0 || page >= totalPages.value) return;

    eventBus.emit('goToPage', page);
}

function getPagesSlice(){
    const page = options.value.page;

    if(!unref(page)) return pages.value.slice(0, 3);

    if(page === totalPages.value) return pages.value.slice(-3);

    return pages.value.slice(page-1, page+2);
}
</script>

<style scoped>

</style>
