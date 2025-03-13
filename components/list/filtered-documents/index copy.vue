<template>
<div  class="row position-relative">
    <Spinner v-if="loading" :size="300" :is-modal="true"/>
    <div class="wraptitle col-4">
        <div class="debug mb-2">
          <h4>{{filterTitle }}</h4>
          <div class="dropdown">
            <button @click="onFiltersClick" class="btn  list-filter w-100 text-wrap" type="button" >
              
              <p >
                {{selectedFilterTitle}}
              </p>
              <Icon name="arrow-down" class="float-end" />
            </button>
            <ul v-if="showFilters" v-click-outside="onFiltersClick" class="dropdown-menu menuDates show" role="menu">
              <li @click="onFilterItemClick(filter)" v-for="filter in filters" :key="filter.identifier" class="filter-item mb-2 px-3">
                <span class="filter-item" role="menuitem" tabindex="-1"  >{{filter.title}}</span>

              </li>
            </ul>
          </div>
      </div>
      <div class="debug">
          <h4>{{filterTitle2 }}</h4>
          <div class="dropdown">
            <button @click="onFilters2Click" class="btn  list-filter w-100 text-wrap" type="button" >
              
              <p >
                {{selectedFilter2Title}}
              </p>
              <Icon name="arrow-down" class="float-end" />
            </button>
            <ul v-if="showFilters2" v-click-outside="onFilters2Click" class="dropdown-menu menuDates show" role="menu">
              <li @click="onFilter2ItemClick(filter)" v-for="filter in filters2" :key="filter.identifier" class="filter-item mb-2 px-3">
                <span class="filter-item" role="menuitem" tabindex="-1"  >{{filter.title}}</span>

              </li>
            </ul>
          </div>
      </div>
    </div>


    <div class="col-8">
      <div class="article">
        <!-- Table -->
        <table class="ebsa-table table table-striped">
          <tbody>
            <tr>
              <th colspan="2" >
                {{selectedFilterTitle}}
                <span class="badge bg-info text-dark float-end">{{numberFound}}</span>
              </th>
            </tr>
          <tr v-for="item in data" :key="item.url">
            <td>
              <p >{{item.title}}</p>
            </td>
            <td>
              <NuxtLink :to="item.url" external target="_blank" class="float-end text-nowrap" >{{t('Details')}} »</NuxtLink>
            </td>
          </tr>
          <tr v-if="!numberFound">
            <td colspan="2">{{$t('No records')}}.</td>
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
                                filterProperty : { type: String, default: 'region' },
                                filters2        : { type: Array  },
                                filterTitle2    : { type: String },
                                filterProperty2 : { type: String, default: 'region' }
                            });

  const { data:passedData, filters: passedFilters, filterTitle, filterProperty, filters2:passedFilters2, filterTitle2, filterProperty2  } = toRefs(props);


  const { t }          = useI18n();
  const showFilters    = ref(false);
  const showFilters2    = ref(false);
  const selectedFilter = ref(passedFilters.value[0]);
  const selectedFilter2 = computed(()=> passedFilters2.value.find((f)=> f.identifier === selectedFilter.value?.identifier[0]));
  const selectedFilterTitle = ref(passedFilters.value[0].title);
  const selectedFilter2Title = ref(selectedFilter2.value.title);

  const isArray        = computed(() => Array.isArray(selectedFilter.value?.identifier));
  const filters        = computed(() => passedFilters.value.filter(filter => filter.title !== selectedFilter.value?.title));  
  const filters2       = computed(() => passedFilters2.value.filter(filter => selectedFilter2.value?.identifier?.includes(filter.identifier)));

  const data           = computed(filterData);
  const numberFound    = computed(() => data.value?.length);
  
  function filterData(){
    if(!filters2.value.length)
      return  filterDataOneFilter().sort(sortData);
    else 
      return  filterDataTwoFilter(filterDataOneFilter()).sort(sortData);
  }

  function filterDataOneFilter(){
    return  passedData.value.filter(item => isArray.value? selectedFilter.value?.identifier?.includes(item[filterProperty.value]) : selectedFilter.value?.identifier === item[filterProperty.value])
  }
  function filterDataTwoFilter(data){
    return  data.value.filter(item => selectedFilter2.value?.identifier === item[filterProperty2.value])
  }

  function sortData(a,b){
    return sortArrayOfObjectsByProp(a,b,'title', 'desc');
  }
  function onFiltersClick() {

    showFilters.value = !showFilters.value;
  }

  function onFilterItemClick(filter) {
    selectedFilter.value      = filter;
    selectedFilterTitle.value = filter.title;
    showFilters.value = false;
  }

  watch(passedData, (newVal) => {

    if(!newVal.length) return setTimeout(() => loading.value = false, 1000);;

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