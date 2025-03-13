<template>
    <LazyListFilteredDocuments :data="data" :filters="filters"/>
</template>

<script setup>
const getCops  = useEbsaCops();
const getEbsaDocs = useEbsaDocuments();


const filters = (await getCops());
const data    = (await getEbsaDocs()).data;

</script>