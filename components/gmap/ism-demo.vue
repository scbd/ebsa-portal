
<template>
<ClientOnly>
    <LazyGmap :dataMap="regionMap" :filter-title="filterTitle" :filter-all-title="filterAllTitle"/>
</ClientOnly>
</template>


<script setup >
    const getRegions         = useEbsaRegions();
    const getShapes          = useShapes();

    const regions          = (await getRegions()).data;
    const shapes           = (await getShapes()).data;
    const regionMap        = makeRegionMap(regions, shapes);

    const filterTitle      = 'EBSA Information-sharing Mechanism Map';
    const filterAllTitle   = 'All Regions';
</script>

