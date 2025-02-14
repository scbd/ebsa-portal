<template>
    <div class="d-flex align-items-center w-auto h-50" >
        <ul class="d-flex justify-content-center mb-0 " >
            <li v-for="locale in availableLocales" :key="locale.code"  class="nav-item d-none d-sm-inline-block text-nowrap" > 
                <NuxtLink  @click="changeLanguage(locale.code)" :to="switchLocalePath(locale.code)" class="nav-link" active-class="lang-active" >{{locale.nativeName}}</NuxtLink>  
            </li>
        </ul>
    </div>
</template>
<script setup>
const { locale, locales, setLocaleCookie } = useI18n()
const switchLocalePath = useSwitchLocalePath();

const availableLocales = computed(() => locales.value.filter(i => i.code !== locale.value))

async function changeLanguage(code) {
  setLocaleCookie(code)


  await reloadNuxtApp();
  
 setTimeout(async () => {
    await navigateTo(switchLocalePath(code), { replace: true, })
  }, 500);

  setTimeout(async () => {
    await reloadNuxtApp();
  }, 1000);
}
</script>
<style scoped>
.nav-item{
    padding: 5px 5px;
   
    font-size: .80rem;
    color:#E6E6E6;
}
.lang-active{

    font-weight: bolder !important;
    text-decoration: underline;

}
</style>