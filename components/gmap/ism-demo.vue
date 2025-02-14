
<template>
    <LazyGmap :dataMap="regionMap" :archives="archives" :filterTitle="filterTitle" :filterAllTitle="filterAllTitle"/>
</template>


<script setup >
    const { t }              = useI18n();
    const getRegions         = useEbsaRegions();
    const getShapes          = useShapes();
    const getArchivedShapes  = useShapes(true);

    const regions        = (await getRegions()).data;
    const shapes         = (await getShapes()).data;
    const aShapes        = (await getArchivedShapes()).data;
    const regionMap      = makeRegionMap(regions, shapes);
    const archiveRegionMap = makeArchiveRegionMap(regions, aShapes);
    const archives       = { dataMap: archiveRegionMap };
    const filterTitle    = t('View Areas Meeting the EBSA Criteria');
    const filterAllTitle = t('All Regions');


    function makeRegionMap(regions, shapes){
        const regionMap = {};

        for (const { identifier } of toRaw(regions.value)) {
            const features = (unref(shapes).filter(({ region_s }) => region_s === identifier).map(s=>s.features)).flat().filter(Boolean).map(f=> toRaw(f));

            regionMap[identifier] = { type: 'FeatureCollection', features };
        }

        return toRaw(regionMap)
    }

    function makeArchiveRegionMap(regions, shapes){
            const regionMap = {};

            for (const { identifier } of toRaw(regions.value)) {
                const features = sampleMultiple((unref(shapes).filter(({ region_s }) => region_s === identifier).map(s=>s.features)).flat().filter(Boolean).map(f=> toRaw(f)));

                regionMap[identifier] = { type: 'FeatureCollection', features };
            }

            return toRaw(regionMap)
        }
</script>

