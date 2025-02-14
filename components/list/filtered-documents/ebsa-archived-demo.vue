<template>
    <LazyListFilteredDocuments :data="data" :filters="filters" :filterTitle="filterTitle" />
</template>

<script setup>
const getRegions  = useEbsaRegions();
const getEbsaDocs = useEbsaDocuments();
const filterTitle = ref('EBSA Regions');

const filters = (await getRegions()).data;
const data    = ref(sampleMultiple((await getEbsaDocs()).data.value));


</script>