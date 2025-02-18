<template>
  <footer>
      <div class="container">
        <div class="row">
          <div class="col-3">
            <div class="push15">&nbsp;</div>
            <a href="//www.cbd.int/" target="_blank">
              <img src="/img/cbd-whitelogo.png" alt="Convention on Biological Diversity" />
            </a>
            <br>
            <small class="white">{{t('thisSiteDeveloped')}}</small>
          </div>
          <div class="col-3">
            <div class="push50">&nbsp;</div>
            <div class="push15">&nbsp;</div>
            <img src="/img/icon-pin.png" alt="icon quick links" />
            <h2>Quick links</h2>
            <div class="clear"></div>
            <ul>
              <li><a href="//www.cbd.int/marine/doc/azores-brochure-en.pdf" target="_blank">EBSA Criteria</a></li>
              <li><a href="resources?tab=workshop-reports">Workshop Reports</a></li>
              <li><a href="about?tab=relevantDecisions">Relevant COP Decisions</a></li>
            </ul>
          </div>
          <div class="col-3">
            <div class="push50">&nbsp;</div>
            <div class="push15">&nbsp;</div>
            <img src="/img/icon-sitemap.png" alt="icon site map" />
            <h2>{{t('Site Map')}}</h2>
            <div class="clear"></div>
            <div class="text-center">
              <NuxtLink  to="/"  class="white">{{t('Home')}}</NuxtLink>
            </div>
            <div class="d-flex justify-content-between">
              <ul>
                <li  v-for="link of repoLinks"><NuxtLink :to="link.to" class="flink" >{{link.title}}</NuxtLink></li>
              </ul>
              <ul>
                <li  v-for="link of ismLinks"><NuxtLink :to="link.to" class="flink white" >{{link.title}}</NuxtLink></li>
              </ul>
            </div>
          </div>
          <div class="col-3">
            <div class="push15">&nbsp;</div>
            <img src="/img/icon-contact.png" alt="icon contact" />
            <h2>{{t('Contact')}}</h2>
            <div class="clear"></div>
            <h4 class="white">{{t('CBD Secretariat')}}</h4>

            <p>{{t('address413')}}<br />
              {{t('Montreal QC')}}<br />
              {{t('Canada H2Y 1N9')}}
            </p>
            <h4>
              <NuxtLink class="white" to="mailto:secretariat@cbd.int">secretariat@cbd.int »</NuxtLink>
            </h4>
            <h4>
              <NuxtLink class="white" to="https://www.cbd.int/contact">www.cbd.int »</NuxtLink>
            </h4>
          </div>
          <div class="clear"></div>
          <div class="col-6 offset-3">
            <NuxtLink v-for="link of legalLinks" :to="link.to" :external="link.external" :target="link.target" class="copyright">{{link.title}}</NuxtLink>
          </div>
        </div>
      </div>
  </footer>

</template>
<script setup>
const { t }  = useI18n();
const localePath  = useLocalePath();
const legalLinks = [
    { title: t('Terms of Use'),      to: 'https://www.cbd.int/terms',    target: "_blank", external:true },
    { title: t('Privacy Policy'),    to: 'https://www.cbd.int/privacy',   target: "_blank", external:true },
    { title: t('Credits'),           to: 'https://www.cbd.int/credits',   target: "_blank", external:true },
    { title: t('© CBD Secretariat'), to: 'https://www.cbd.int/copyright', target: "_blank", external:true }
  ]

const repoLinks = [
  { title: t('Repository'), to: localePath('/repository') },
  { title: t('About'),      to: localePath('/repository/about') },
  { title: t('EBSAS'),      to: localePath('/repository/ebsas') },
  { title: t('Archive'),      to: localePath('/repository/archive') },
];

const ismLinks = [
  { title: t('ISM'), to: localePath('/ism') },
  { title: t('ISMS'),      to: localePath('/ism/isms') },
  { title: t('Meetings'),      to: localePath('/ism/meetings') },
  { title: t('Resources'),      to: localePath('/ism/resources') },
  { title: t('Collaborators'),      to: localePath('/ism/collaborators') }

  
];
</script>
<style scoped>
  .copyright{
    text-decoration: none;
    color: #fff;
  }
  .copyright:hover{
    text-decoration: underline;
  }
  .flink{
    text-decoration: none;
    color: #fff;
  }
  .flink:hover{
    text-decoration: underline;
  }
</style>