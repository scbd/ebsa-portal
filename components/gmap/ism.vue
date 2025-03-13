
<template>
    <LazyGmap  :dataMap="regionMap" :archives="archives" />
</template>

<script setup >
    const getRegions         = useEbsaRegions();

    const regions        = (await getRegions()).data;
    const shapes         = ref([])
    const regionMap      = makeRegionMap(regions, shapes);
    const archiveRegionMap = [];
    const archives       = { dataMap: archiveRegionMap };
</script>

