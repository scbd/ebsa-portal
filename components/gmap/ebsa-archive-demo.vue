
<template>

    <LazyGmap color="red":filters="regions" :data-map="regionMap" :filter-title="filterTitle" :filter-all-title="filterAllTitle"/>

</template>


<script setup >
    const { t }          = useI18n();
    const getRegions     = useEbsaRegions();
    const getShapes      = useShapes('ebsa');

    const regions        = (await getRegions()).data;
    const shapes         = (await getShapes()).data;
    const regionMap      = makeRegionMapSample(regions, shapes);
    const filterTitle    = t('Archived EBSAs');
    const filterAllTitle = t('All Regions');

</script>

