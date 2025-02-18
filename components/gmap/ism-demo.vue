
<template>
<ClientOnly>
    <LazyGmap :dataMap="regionMap" :archives="archives" :filter-title="filterTitle" :filter-all-title="filterAllTitle"/>
</ClientOnly>
</template>


<script setup >
    const getRegions         = useEbsaRegions();
    const getShapes          = useShapes();
    const getArchivedShapes  = useShapes(true);

    const regions          = (await getRegions()).data;
    const shapes           = (await getShapes()).data;
    const aShapes          = (await getArchivedShapes()).data;
    const regionMap        = makeRegionMap(regions, shapes);
    const archiveRegionMap = makeRegionMapSample(regions, aShapes);
    const archives         = { dataMap: archiveRegionMap };
    const filterTitle      = 'View Areas Meeting the EBSA Criteria';
    const filterAllTitle   = 'All Regions';
</script>

