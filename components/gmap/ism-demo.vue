
<template>
    <LazyGmap :dataMap="regionMap"  />
</template>


<script setup >
    const getRegions         = useEbsaRegions();
    const getShapes          = useShapes();

    const regions          = (await getRegions()).data;
    const shapes           = (await getShapes()).data;
    const regionMap        = makeRegionMap(regions, shapes);

</script>

