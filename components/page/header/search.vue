<template>
    <div>
        <AisInstantSearchSsr>
        <AisConfigure :hits-per-page.camel="4" v-if="$route.params.indexName === 'instant_search'"
            :facet-filters.camel="`brand:${$route.params.brand}`" />
        <AisRefinementList :attribute="$route.params.indexName === 'airbnb' ? 'room_type' : 'categories'
            ">
        </AisRefinementList>
        <AisInfiniteHits show-previous>
            <template #loadPrevious="{ isFirstPage, refinePrevious }">
            <button :disabled="isFirstPage" @click="refinePrevious">
                Load less
            </button>
            </template>
            <!-- <template v-slot="{ items, refineNext, isLastPage }">
            <div class="cont">
                <div v-for="item in items" :key="item.objectID" class="item">
                {{ item.name }}
                <img :src="item.image ?? item.thumbnail_url" />
                {{ item }}
                </div>
            </div>
            <button :disabled="isLastPage" @click="refineNext">Load more</button>
            </template> -->
        </AisInfiniteHits>
        </AisInstantSearchSsr>
    </div>
</template>
<script setup>

import { AisRefinementList,  AisInstantSearchSsr, AisConfigure, AisSearchBox, AisHits, AisInfiniteHits } from 'vue-instantsearch/vue3/es'
import { createServerRootMixin } from 'vue-instantsearch/vue3/es'
import { renderToString } from 'vue/server-renderer'
const algolia = useAlgoliaRef()

const serverRootMixin = ref(
  createServerRootMixin({
    searchClient: algolia,
    indexName:'ebsas',
  }),
)

const { instantsearch } = serverRootMixin.value.data()
provide('$_ais_ssrInstantSearchInstance', instantsearch)

onBeforeMount(() => {
  // Use data loaded on the server
  if (algoliaState.value) {
    instantsearch.hydrate(algoliaState.value)
  }
})

const { data: algoliaState } = await useAsyncData('algolia-state', async () => {
    if (import.meta.server) {
        const nuxtApp = useNuxtApp();
        nuxtApp.$algolia.transporter.requester = (
            await import('@algolia/requester-node-http').then(
                (lib) => lib.default || lib
            )
        ).createNodeHttpRequester();
    }
    return instantsearch.findResultsState({
        // IMPORTANT: a component with access to `this.instantsearch` to be used by the createServerRootMixin code
        component: {
            $options: {
                components: {
                    AisInstantSearchSsr,
                    AisIndex,
                    AisConfigure,
                    AisRefinementList,
                    AisHits,
                    AisHighlight,
                    AisSearchBox,
                    AisStats,
                    AisPagination,
                },
                data() {
                    return { instantsearch };
                },
                provide: { $_ais_ssrInstantSearchInstance: instantsearch },
                render() {
                    return h(AisInstantSearchSsr, null, () => [
                        // Include any vue-instantsearch components that you use including each refinement attribute
                        h(AisHits),
                    ]);
                },
            },
        },
        renderToString,
    });
})
</script>