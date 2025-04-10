
<template>
<ClientOnly>
    <LazyGmap  :data-map="regionMap"  :filter-title="filterTitle" :filter-all-title="filterAllTitle"/>
</ClientOnly>
</template>


<script setup >
    const getRegions         = useEbsaRegions();
    const getShapes          = useShapes();

    const regions        = (await getRegions()).data;
    const shapes         = (await getShapes()).data;
    const regionMap      = makeRegionMap(regions, shapes);
    const filterTitle    = 'View Areas Meeting the EBSA Criteria';
    const filterAllTitle = 'All Regions';

</script>

