<template>
    <LazyListFilteredDocuments :data="data" :filters="filters"  />
</template>

<script setup>

const getCops     = useEbsaCops();
const filters     = (await getCops());
const data        = ref([])

</script>