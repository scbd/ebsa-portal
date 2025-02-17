<template>
    <ClientOnly>
        <LazyListFilteredDocuments :data="data" :filters="filters" :filter-title="filterTitle" filter-property="year"/>
    </ClientOnly>
</template>

<script setup>
const getFilters   = useIsmYearFilter();
const getIsmDocs   = useEbsaDocuments();
const filterTitle  = ref('Created Year');

const filters = (await getFilters()).data;
const data    = sampleMultiple((await getIsmDocs()).data.value);



</script>