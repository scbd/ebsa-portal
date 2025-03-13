<template>
    <LazyListFilteredDocuments v-if="filters.length && filters2.length  " :data="data" :filters="filters" :filters2="filters2" />
</template>

<script setup>

const getRegions = useEbsaRegions();
const getCops  = useEbsaCops();
const getEbsaDocs = useEbsaDocuments();


const filters  = (await getCops());
const filters2 = (await getRegions()).data;
const data     = []

</script>