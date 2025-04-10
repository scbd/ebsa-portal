
<template>
<div class="w-100 h-100 d-flex flex-column  align-items-center justify-content-between">
  <div class="position-absolute  top-0 w-75 mt-3  text-white">
   
      <div class="ck-content  p-3 text-white">
                <div ref="contentEl" class="cont" v-html="htmlSanitize(content)"></div>
      </div>
                        
  </div>
  <div class="center ">
    <div class="d-flex justify-content-between">
      <NuxtLink  v-for="(button, key) of buttons"  :to="localPath(button.path)" class="text-decoration-none">
        <button class="landing-button mx-5" :class="{ 'landing-button-alt': key%2 }" >
          <span class="text-center">{{button.name}}</span>
        </button>
      </NuxtLink>
    </div>
  </div>

  <ClientOnly>
    <div v-if="canEdit" class="position-absolute top-0 w-100 d-flex justify-content-end">
   
      <button  @click="gotToEdit" class="btn  btn-sm btn-light m-2" external>
          <Icon name="edit" color="#000000"/>
      </button>

    </div>
  </ClientOnly>
</div>
</template>


<script setup >
definePageMeta({ layout: 'landing' });


const { isAuthenticated, hasRole } = useScbdAuth     ();
const { oasisApi        } = useRuntimeConfig().public;
const   url               = useRequestURL   ();
const   localPath         = useLocalePath();
const   page              = useState('page');
const { t, locale }       = useI18n();
const   contentEl         = ref();
const   _id               = computed(()=>page.value?._id);
const   content           = computed(()=>page.value?.content);
const   buttons           = computed(makeButtons);


const editRoles = ["oasisArticleEditor", "CBD_EDIT-MAR", 'Administrator'];

const editUri = computed(()=>`${oasisApi}/articles/${_id.value}/edit?returnUrl=${encodeURIComponent(url.href)}`);


const canEdit = computed(()=>_id.value && isAuthenticated.value && hasRole(editRoles));

async function gotToEdit(){
  await navigateTo(editUri.value, {external: true});
}
function makeButtons(){
    const buttons = [];

    for (const prop in page?.value?.customProperties) {
      
      if(!prop.startsWith('landingButtonPath') && !prop.startsWith('landingButtonName')) continue;

      const index = Number(prop.replace('landingButtonPath', '').replace('landingButtonName', ''));

      if(!buttons[index]) buttons[index] = {};
      
      if(prop.startsWith('landingButtonPath'))
        buttons[index].path = page.value?.customProperties[prop];
      else
        buttons[index].name = JSON.parse(page.value?.customProperties[prop]);
    }

    for (const button of buttons) {
      if(!button.path || !button.name) continue;
      button.name = button.name[locale.value] || button.name.en;
    }

    return buttons;
}
</script>

<style lang="scss" scoped>

.landing-button {
    background-color: #E0FFFF;
    font-family: Overlock;
    font-weight: bold;
    line-height: 1.5rem;
    font-size: 1.5rem;
    height: 125px;
    cursor: pointer;
    width: 275px;
    border-radius: 25px;
    border: none;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2.5px 4px;
    transition: box-shadow 0.3s ease;
} 
.landing-button:hover{
  box-shadow: rgba(0, 0, 0, 0.5) 0px 6.5px 12px;
  background-color: #b3f4f4;
}

.landing-button-alt{
  background-color: #CEF7DC;
}
.landing-button-alt:hover{
  background-color: #b8f6cd;
}

tr td {
  background-color: rgba(0,0,0,.5) !important;
}

.center {
            display: flex;
            justify-content: center;
            align-items: center;
            height:100%;
            width: 100%;
            color: white;
        }
.card-sep {
    background-color: rgba(0,0,0,0.0);
    height: 250px;
    cursor: pointer;
    width: 250px;
}
.card-bg {
            background-color: rgba(0,0,0,0.6);
            height: 250px;
            cursor: pointer;
            width: 250px;
        }
.card-bg:hover {
    background-color: rgba(0,0,0,1);
    font-weight: bold;
    cursor: pointer;
}
.card-title-white {
    color: white;
    font-size: 2.5rem;
    text-decoration: none !important;
}

</style>