
<template>
    <LazyGmap  :data-map="regionMap"  :filter-title="filterTitle" :filter-all-title="filterAllTitle"/>
</template>


<script setup >
    const getRegions         = useEbsaRegions();
    const getShapes          = useShapes();
    const getArchivedShapes  = useShapes(true);

    const regions          = (await getRegions()).data;
    const shapes           = (await getShapes()).data;

    const regionMap        = makeRegionMap(regions, shapes);
    const archiveRegionMap = [];
    const filterTitle      = 'View Areas Meeting the EBSA Criteria';
    const filterAllTitle   = 'All Regions';

</script>

