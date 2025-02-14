<template>
    <ClientOnly>
        <NuxtLink v-if="canEdit" :to="editUri" class="float-end edit pt-1" external>
            <Icon name="edit" /> <span v-if="!hideText">{{t('Edit')}}</span>
        </NuxtLink>
    </ClientOnly>
</template>
    
<script setup>
const props   = defineProps({ _id: { type: String}, hideText: { type: Boolean, default: false } });
const { _id, hideText } = toRefs(props);

const   url                        = useRequestURL   ();
const { t               }          = useI18n         ();
const { isAuthenticated, hasRole } = useScbdAuth     ();
const { oasisApi        }          = useRuntimeConfig().public;

const editRoles = ["oasisArticleEditor", "CBD_EDIT-MAR"];

const editUri = computed(()=>`${oasisApi}/articles/${_id.value}/edit?returnUrl=${encodeURIComponent(url.href)}`);


const canEdit = computed(()=>_id.value && isAuthenticated.value && hasRole(editRoles));
</script>

<style scoped>

.edit{
    color: #247080;
    text-decoration: none;
}
</style>