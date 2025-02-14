
<template>
<div class="w-100 h-100">
  <div class="center">
    <div class="d-flex justify-content-between">

      <NuxtLink to="/repository" class="text-decoration-none">
        <div class="card card-bg mx-5" >
          <div class="card-body d-flex align-items-center justify-content-center">
            <h5 class="card-title text-center card-title-white text-decoration-none">
              {{t('Repository')}}
            </h5>
          </div>
        </div>
      </NuxtLink>
      <!-- <div class="card card-sep mx-5" >
          <div class="card-body d-flex align-items-center justify-content-center">
            &nbsp;

          </div>
      </div> -->
      <NuxtLink to="/ism" class="text-decoration-none">
        <div class="card card-bg mx-5" >
          <div class="card-body d-flex align-items-center justify-content-center">
            <h5 class="card-title text-center card-title-white text-decoration-none">
              {{t('Information Sharing Mechanism')}}
            </h5>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</div>
</template>


<script setup >
definePageMeta({ layout: 'landing' });

const { t }  = useI18n();

</script>

<style scoped>

.center {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
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