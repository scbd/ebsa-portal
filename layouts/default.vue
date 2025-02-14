<template>
    <div class="fluid-container">
        <LazyIconSymbols v-once/>
        <ClientOnly>
            <NuxtLoadingIndicator :height="6"/>
        </ClientOnly>   

        <LazyPageHeader/>
        <LazyPageHeaderHeroImage />
        <LazyPageHeaderNavBar  />
        <LazyPageHeaderCrumbs />

        <main class="container">
            <slot/>
        </main>

        <LazyPageFooter/>
    </div>
</template>
<script setup>

</script>

<style lang="scss">
main { min-height: 50vh; }
</style>