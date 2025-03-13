<template>
    <LazyListFilteredDocuments :data="data" :filters="filters" :filter-title="filterTitle"  filter-property="year"/>
</template>

<script setup>
const getFilters   = useIsmYearFilter();
const getIsmDocs   = useIsmDocuments();
const filterTitle  = ref('Created Year');

const filters = (await getFilters()).data;
const data    = []//(await getIsmDocs()).data;

</script>