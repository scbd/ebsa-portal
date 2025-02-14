<template>
  <div  class="row position-relative">
      <Spinner v-if="loading" :size="300" :is-modal="true"/>

      <div class="col-12">
        <div class="article">
          <!-- Table -->
          <table class="ebsa-table table table-striped">
            <tbody>
              <tr>
                <th colspan="2" >
         
                  <span class="badge bg-info text-dark float-end">{{numberFound}}</span>
                </th>
              </tr>
            <tr v-for="item in data" :key="item.url">
              <td>
                <p >{{item.title}}</p>
              </td>
              <td>
                <NuxtLink :to="item.url" external target="_blank" class="float-end" >Details »</NuxtLink>
              </td>
            </tr>
            <tr v-if="!numberFound">
              <td colspan="2">No records.</td>
            </tr>
          </tbody></table>
        </div>
      </div>
  </div>
  </template>
  <script setup>
    const loading = ref(true);
    const props = defineProps({   
                                  data           : { type: Array  },
                                  title    : { type: String },
                              });
  
    const { data, title  } = toRefs(props);
  
    const { t }          = useI18n();
    const numberFound    = computed(() => data.value.length);
    
    onMounted(() => {
      setTimeout(() => loading.value = false, 500);
    })

  
  </script>
  
  <style scoped>

  </style>