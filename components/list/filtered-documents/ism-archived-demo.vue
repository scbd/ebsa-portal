<template>
    <LazyListFilteredDocuments :data="data" :filters="filters" :filterTitle="filterTitle" filterProperty="year"/>
</template>

<script setup>
const getFilters   = useIsmYearFilter();
const getIsmDocs   = useEbsaDocuments();
const filterTitle  = ref('Created Year');

const filters = (await getFilters()).data;
const data    = sampleMultiple((await getIsmDocs()).data.value);



</script>