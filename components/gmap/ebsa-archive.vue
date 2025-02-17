
<template>
    <LazyGmap color="red":filters="regions" :data-map="regionMap" :filter-title="filterTitle" :filter-all-title="filterAllTitle"/>
</template>


<script setup >
    const getRegions     = useEbsaRegions();
    const getShapes      = useShapes('ebsa');
    const regions        = (await getRegions()).data;
    const shapes         = [];
    const regionMap      = makeRegionMapSample(regions, shapes);
    const filterTitle    = 'Archived EBSAs';
    const filterAllTitle = 'All Regions';

</script>

