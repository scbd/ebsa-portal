
<template>
<ClientOnly>
    <LazyGmap color="red":filters="regions" :data-map="regionMap" :filter-title="filterTitle" :filter-all-title="filterAllTitle"/>
</ClientOnly>
</template>


<script setup >
    const getRegions     = useEbsaRegions();
    const getShapes      = useShapes('ebsa');

    const regions        = (await getRegions()).data;
    const shapes         = (await getShapes()).data;
    const regionMap      = makeRegionMapSample(regions, shapes);
    const filterTitle    = 'Archived EBSAs';
    const filterAllTitle = 'All Regions';
</script>

