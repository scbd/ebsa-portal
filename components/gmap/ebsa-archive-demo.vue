
<template>
    <LazyGmap color="red" :data-map="regionMap"/>
</template>


<script setup >
    const getRegions     = useEbsaRegions();
    const getShapes      = useShapes('ebsa');

    const regions        = (await getRegions()).data;
    const shapes         = (await getShapes()).data;
    const regionMap      = makeRegionMapSample(regions, shapes);

</script>

