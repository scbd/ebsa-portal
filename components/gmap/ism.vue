
<template>
    <LazyGmap  :dataMap="regionMap" :archives="archives" :filter-title="filterTitle" :filter-all-title="filterAllTitle"/>
</template>


<script setup >
    const { t }              = useI18n();
    const getRegions         = useEbsaRegions();
    const getShapes          = useShapes();
    const getArchivedShapes  = useShapes(true);

    const regions        = (await getRegions()).data;
    const shapes         = ref([])
    const regionMap      = makeRegionMap(regions, shapes);
    const archiveRegionMap = [];
    const archives       = { dataMap: archiveRegionMap };
    const filterTitle    = t('View Areas Meeting the EBSA Criteria');
    const filterAllTitle = t('All Regions');



</script>

