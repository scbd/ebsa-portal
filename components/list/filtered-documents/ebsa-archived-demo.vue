<template>
        <ClientOnly>
            <LazyListFilteredDocuments :data="data" :filters="filters" />
        </ClientOnly>
</template>

<script setup>
const getCops     = useEbsaCops();
const getEbsaDocs = useEbsaDocuments();

const filters     = (await getCops());
const rawData     = (await getEbsaDocs()).data.value;
const data        = sampleMultiple(rawData);


</script>