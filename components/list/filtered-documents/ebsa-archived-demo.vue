<template>
        <ClientOnly>
            <LazyListFilteredDocuments :data="data" :filters="filters" :filter-title="filterTitle" />
        </ClientOnly>
</template>

<script setup>
const getRegions  = useEbsaRegions();
const getEbsaDocs = useEbsaDocuments();
const filterTitle = ref('EBSA Regions');

const filters = (await getRegions()).data;
const data    = ref(sampleMultiple((await getEbsaDocs()).data.value));


</script>