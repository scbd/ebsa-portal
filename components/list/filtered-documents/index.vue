<template>
<div  class="row position-relative">
    <Spinner v-if="loading" :size="300" :is-modal="true"/>
    <div class="wraptitle col-4">

        <h4>{{filterTitle }}</h4>
        <div class="dropdown">
          <button @click="onFiltersClick" class="btn  list-filter w-100 text-wrap" type="button" >
            
            <p >
              {{t(selectedFilter)}}
            </p>
            <Icon name="arrow-down" class="float-end" />
          </button>
          <ul v-if="showFilters" v-click-outside="onFiltersClick" class="dropdown-menu menuDates show" role="menu">
            <li @click="onFilterItemClick(filter.identifier)" v-for="filter in filters" :key="filter.identifier" class="filter-item mb-2 px-3">
              <span class="filter-item" role="menuitem" tabindex="-1"  >{{t(filter.identifier)}}</span>

            </li>
          </ul>
        </div>
    </div>


    <div class="col-8">
      <div class="article">
        <!-- Table -->
        <table class="ebsa-table table table-striped">
          <tbody>
            <tr>
              <th colspan="2" >
                {{t(selectedFilter)}}
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
                                filters        : { type: Array  },
                                filterTitle    : { type: String },
                                filterProperty : { type: String, default: 'region' }
                            });

  const { data:passedData, filters: passedFilters, filterTitle, filterProperty  } = toRefs(props);


  const { t }          = useI18n();
  const showFilters    = ref(false);
  const selectedFilter = ref(passedFilters.value[0].identifier);
  const filters        = computed(() => passedFilters.value.filter(filter => filter.identifier !== selectedFilter.value));                         
  const data           = computed(() => passedData.value.filter(item => item[filterProperty.value] === selectedFilter.value));
  const numberFound    = computed(() => data.value.length);
  

  function onFiltersClick() {
    showFilters.value = !showFilters.value;
  }

  function onFilterItemClick(filter) {
    selectedFilter.value = filter;
    showFilters.value = false;
  }

  watch(passedData, (newVal) => {

    if(!newVal.length) return;

    setTimeout(() => loading.value = false, 500);

  }, { immediate: true }); 
</script>

<style scoped>
  .filter-item {
    cursor: pointer;
    font-size: 12px;
  }
  .filter-item:hover {
    color:#3c80a6;
  }
</style>