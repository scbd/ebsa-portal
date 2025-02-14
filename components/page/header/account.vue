<template>
    <div class="d-flex align-items-center w-auto h-50" >
        <ClientOnly>
            <ul class="d-flex justify-content-center mb-0 " >
                <li v-if="!isAuthenticated" class="nav-item d-none d-sm-inline-block text-nowrap" > 
                    <NuxtLink  :to="signInUrl" class="nav-link" active-class="lang-active" external >Sign In</NuxtLink>  
                </li>
                <li v-if="isAuthenticated" @click="toggleDrop"  class="nav-item d-none d-sm-inline-block text-nowrap position-relative" > 
                    <NuxtLink  to="#" class="nav-link" active-class="lang-active" external >{{name}} <Icon name="arrow-down" color="#e6e6e6"/></NuxtLink> 
                

                    <div v-if="dropOpen" v-click-outside="toggleDrop" class="position-absolute mt-2 drop w-100">
                        <ul class="list-unstyled">
                            <li class="nav-item">
                                <NuxtLink @click="signOut" to="#" class="nav-link" active-class="lang-active">{{t('Sign Out')}}</NuxtLink>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </ClientOnly>
    </div>
</template>
<script setup>
const { isAuthenticated, user, logout } = useScbdAuth();
const { t } = useI18n();
const { authApiUrl } = useRuntimeConfig().public
const   url         = useRequestURL();
const   dropOpen    = ref(false);
const name      = computed(() => user.value ? user.value.name : '');
const returnUrl = computed(() => url.href );
const signInUrl = computed(() => `${authApiUrl}/signin?returnurl=${returnUrl.value}`);


function signOut(){ logout(url.href); toggleDrop();}
function toggleDrop(){ dropOpen.value = !dropOpen.value; }  
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
.drop{
    background-color: #497073
}
</style>