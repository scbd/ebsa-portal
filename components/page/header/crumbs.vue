<template>
    <ClientOnly>
        <div v-if="showBreadcrumbs && !isTopLevel" class="container px-4 pt-3">
            <ol class="breadcrumb">
                <li v-for="(breadcrumb, key) in breadcrumbs" :key='key'>
                    <NuxtLink v-if="!breadcrumb.current" :to="breadcrumb.to">
                        {{breadcrumb.ariaLabel}}
                    </NuxtLink>

                    <span v-if="breadcrumb.current">{{overRide.ariaLabel || current.ariaLabel}}</span>
                </li>
            </ol>
        </div>
    </ClientOnly>
</template>
<script  setup>
    const { t }             = useI18n();
    const   eventBus        = useEventBus();
    const { isTopLevel }    = useMenuLevels();
    const   breadcrumbs     = useBreadcrumbItems();
    const   showBreadcrumbs = computed(() => breadcrumbs?.value?.length > 1);

    const overRide    = ref({});
    const currentItem = computed(() => breadcrumbs.value.find(breadcrumb => breadcrumb.current));
    const current     = computed(() => overRide?.value?.to? overRide.value : currentItem.value);

    eventBus.on('page', (page)=>{ overRide.value = page.crumb;  });
</script>
