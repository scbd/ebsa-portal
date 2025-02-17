
<template>
    <LazyGmap color="red":filters="regions" :data-map="regionMap" :filter-title="filterTitle" :filter-all-title="filterAllTitle"/>
    <LazyGmap color="red":filters="regions" :dataMap="regionMap" :filterTitle="filterTitle" :filterAllTitle="filterAllTitle"/>

</template>


<script setup >
    const { t }          = useI18n();
    const getRegions     = useEbsaRegions();
    const getShapes      = useShapes('ebsa');

    const regions        = (await getRegions()).data;
    const shapes         = []//(await getShapes()).data;
    const regionMap      = makeRegionMap(regions, shapes);
    const filterTitle    = t('Archived EBSAs');
    const filterAllTitle = t('All Regions');


    function makeRegionMap(regions, shapes){
        const regionMap = {};

        for (const { identifier } of toRaw(regions.value)) {
            const features = (unref(shapes).filter(({ region_s }) => region_s === identifier).map(s=>s.features)).flat().filter(Boolean).map(f=> toRaw(f));

            regionMap[identifier] = { type: 'FeatureCollection', features };
        }

        return toRaw(regionMap)
    }


</script>

