<template>
    <div class="bt-3">
        <component  v-for="compName in componentNames" :is="getComponent(compName)"></component>
    </div>
</template>

<script setup>
    // const name = resolveComponent('LazyDocumentList');
    // customProperties
    const page = useState('page');

    function getComponent(name){
        const compMap = {}


        compMap['LazyListFilteredDocumentsEbsa']  = resolveComponent('LazyListFilteredDocumentsEbsa');
        compMap['ListFilteredDocumentsEbsa']      = compMap['LazyListFilteredDocumentsEbsa'];

        compMap['LazyListFilteredDocumentsEbsaArchived']  = resolveComponent('LazyListFilteredDocumentsEbsaArchived');
        compMap['ListFilteredDocumentsEbsaArchived']      = compMap['LazyListFilteredDocumentsEbsaArchived'];

        compMap['LazyListFilteredDocumentsEbsaArchivedDemo']  = resolveComponent('LazyListFilteredDocumentsEbsaArchivedDemo');
        compMap['ListFilteredDocumentsEbsaArchivedDemo']      = compMap['LazyListFilteredDocumentsEbsaArchivedDemo'];

        compMap['LazyListFilteredDocumentsIsmArchivedDemo']  = resolveComponent('LazyListFilteredDocumentsIsmArchivedDemo');
        compMap['ListFilteredDocumentsIsmArchivedDemo']      = compMap['LazyListFilteredDocumentsIsmArchivedDemo'];

        compMap['LazyListFilteredDocumentsIsmDemo']  = resolveComponent('LazyListFilteredDocumentsIsmDemo');
        compMap['ListFilteredDocumentsIsmDemo']      = compMap['LazyListFilteredDocumentsIsmDemo'];

        compMap['LazyListFilteredDocumentsIsmArchived']  = resolveComponent('LazyListFilteredDocumentsIsmArchived');
        compMap['ListFilteredDocumentsIsmArchived']      = compMap['LazyListFilteredDocumentsIsmArchived'];

        compMap['LazyListFilteredDocumentsIsm']  = resolveComponent('LazyListFilteredDocumentsIsm');
        compMap['ListFilteredDocumentsIsm']      = compMap['LazyListFilteredDocumentsIsm'];

        compMap['LazyGmapEbsa']  = resolveComponent('LazyGmapEbsa');
        compMap['GmapEbsa']      = compMap['LazyGmapEbsa'];

        compMap['LazyGmapEbsaDemo']  = resolveComponent('LazyGmapEbsaDemo');
        compMap['GmapEbsaDemo']      = compMap['LazyGmapEbsaDemo'];

        compMap['LazyGmapEbsaArchive']  = resolveComponent('LazyGmapEbsaArchive');
        compMap['GmapEbsaArchive']      = compMap['LazyGmapEbsaArchive'];

        compMap['LazyGmapEbsaArchiveDemo']  = resolveComponent('LazyGmapEbsaArchiveDemo');
        compMap['GmapEbsaArchiveDemo']      = compMap['LazyGmapEbsaArchiveDemo'];



        compMap['LazyGmapIsm']  = resolveComponent('LazyGmapIsm');
        compMap['GmapIsm']      = compMap['LazyGmapIsm'];

        compMap['LazyGmapIsmArchive']  = resolveComponent('LazyGmapIsmArchive');
        compMap['GmapIsmArchive']      = compMap['LazyGmapIsmArchive'];

        compMap['LazyGmapIsmDemo']  = resolveComponent('LazyGmapIsmDemo');
        compMap['GmapIsmDemo']      = compMap['LazyGmapIsmDemo'];

        compMap['LazyListMeetingsPast']  = resolveComponent('LazyListMeetingsPast');
        compMap['ListMeetingsPast']      = compMap['LazyListMeetingsPast'];

        compMap['LazyListMeetingsFuture']  = resolveComponent('LazyListMeetingsFuture');
        compMap['ListMeetingsFuture']      = compMap['LazyListMeetingsFuture'];

        compMap['LazyListMeetingsWidget']  = resolveComponent('LazyListMeetingsWidget');
        compMap['ListMeetingsWidget']      = compMap['LazyListMeetingsWidget'];

        compMap['LazyListMeetingsWidgetDemo']  = resolveComponent('LazyListMeetingsWidgetDemo');
        compMap['ListMeetingsWidgetDemo']      = compMap['LazyListMeetingsWidgetDemo'];
        return compMap[name];
    }
    const componentNames = computed(getComponents);
    function getComponents(){
        const customProperties = page.value?.customProperties || {};
        const componentNames   = [];

        for (const [key, value] of Object.entries(customProperties))
            if(key.startsWith('componentBelow'))
                componentNames.push(value);

        return componentNames;
    }


//     function getComponents(){
//         const customProperties = page.value?.customProperties || {};
// consola.warn('customProperties', customProperties)
//         const componentNames = []
//         forof (const [key, value] of Object.entries(customProperties)){
//             if(key.startsWith('componentBelow'))
//                 return componentNames.push(resolveComponent(value));

//         }

//         return componentNames.reverse();
//     }
</script>