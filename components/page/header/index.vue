<template>
          <div class="wrapper" >
            <div class="header-bg">
              <div class="container">
                <div class="row logo-title">
                  <div class="col-1">
                    <a href="/ebsa" title="ebsaFullName">
                      <img src="/img/logo.png" alt="EBSAs logo" />
                    </a>
                  </div>
                  
                  <div class="col-9 website-title ">
                    <div class="push15"></div>

                      <h2>{{t('ebsaFullName')}}</h2>
                      <h3>{{t(`specialPlaces`)}}</h3>
                
                  </div>

                  <div class="col-2 ">
                    <!-- <PageHeaderLocaleSelect class="float-end" /> -->
                    <PageHeaderAccount class="float-end" />
                
                  </div>
                </div>
              </div>
            </div>
          </div>

</template>
<script setup>


const { t }  = useI18n();

const page = ref({
    title: 'Home'
  });
const menu =   ref([{
        'title': 'Home',
        'link': '/ebsa'
      }, {
        'title': 'About',
        'link': 'about'
      }, {
        'title': 'EBSA<span class="lower">s</span>',
        'link': 'ebsas'
      }, {
        'title': 'Meetings',
        'link': 'meetings'
      }, {
        'title': 'Resources',
        'link': 'resources'
      }, {
        'title': 'Collaborators',
        'link': 'collaborators'
      }]);
</script>
<style scoped>
.debug {
  border: 1px solid red;
}
</style>