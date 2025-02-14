<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { locale } = useI18n();

const localHead  = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true
})

useHead({
  htmlAttrs: {
    lang: locale,
    dir: () => localHead.value.htmlAttrs.dir
  }
})
</script>