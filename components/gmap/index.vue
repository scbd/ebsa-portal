
<template>
    <ClientOnly>
      <div ref="googleCont" class="row">
        <div  v-if="hasFilters" class="col-2 regions">
          <h3 class="my-2">{{t(filterTitle)}}</h3>
          <div @click="selectFilter('all')" class="region selected">{{t(filterAllTitle)}}</div>
          <div @click="selectFilter(filter.identifier)" v-for="filter of filters" class="region">{{t(filter.identifier)}}</div>
        </div>
        <div class="px-0 position-relative" :class="{ 'col-10': hasFilters, 'col-12': !hasFilters }">
          <Spinner v-if="!isLoaded" :size="300" :is-modal="true"/>
            <ScriptGoogleMaps 
            ref="maps"
            :center="query"
            :api-key="googleMapsKey"
            class="group"
            above-the-fold
            @ready="handleReady"
            trigger="immediate"
            :map-options="mapOptions"
            :width="width"
            :height="height"
          />
        </div>
        <div class="col-12 regions">
          <span class="text-muted text-black-50">{{t('disclaimer')}}</span>
        </div>
      </div>
    </ClientOnly>
</template>


<script setup >

  const { googleMapsKey } = useRuntimeConfig().public;
  const props = defineProps({   
                                data           : { type: Array  },
                                dataMap        : { type: Object  },
                                filters        : { type: Array  },
                                filterTitle    : { type: String },
                                filterAllTitle : { type: String, default: 'All' },
                                color          : { type: String, default: 'white' },
                                archives       : { type: Object  },
                            });

const { data, dataMap, filters, color, filterTitle, filterAllTitle, archives } = toRefs(props);

  const hasArchives = computed(() => archives.value); 
  const showArchives = ref(false);
  const hasFilters = computed(() => filters.value?.length > 0);
  const { t }      = useI18n();
  const googleCont = ref();
  const maps       = ref();

  const isLoaded       = ref(false);
  const infoWindow     = ref();
  const mainMap        = ref()
  const width          = ref(2048)
  const height         = ref(1224)
  const query          = ref({ lat:  -37.7995487, lng: 144.9867841, });
  const listener       = ref([]);
  const defaultStyle   = { strokeColor: color.value, strokeOpacity: 0.75, strokeWeight: 2, fillColor: color.value, fillOpacity: 0.25};
  const archiveStyle   = { strokeColor: 'red', strokeOpacity: 0.75, strokeWeight: 2, fillColor: 'red', fillOpacity: 0.25,  };
  const selectedFilter = ref('all');
  const googleMapsApi  = ref({});                                
  const mapOptions     = {
                            mapTypeId            :'satellite',
                            mapTypeControl       : true,
                            center               : { lat: 13.6036603, lng: -101.313101 },
                            zoom                 : 2,
                            mapTypeControlOptions: { mapTypeIds: [] },
                            streetViewControl    : false 
                          };

  onUnmounted(() => cleanupListeners(googleMapsApi, mainMap));

function handleReady({ map, googleMaps }) {

  infoWindow.value    = new googleMaps.value.InfoWindow();
  googleMapsApi.value = googleMaps.value;
  mainMap.value       = map.value;

  addArchiveControl(mainMap);

  applyStyles(mainMap);


  displayData(mainMap)

  if(filters.value && dataMap.value)
    watch(selectedFilter, (id) => displayData(mainMap, id))

  if(filters.value && archives?.value?.dataMap && showArchives.value)
    watch(selectedFilter, (id) => displayArchiveData(mainMap, id))

  if(archives.value?.dataMap || archives.value?.data)
    watch(showArchives, (show) => show? displayArchiveData(mainMap) : clearMap(mainMap, true))

}

function selectFilter(id){
  selectedFilter.value = id;
  isLoaded.value       = false;
}

function applyStyles(map) {


  map.value.data.setStyle(feature =>  isFeatureArchived(feature)? archiveStyle: defaultStyle );
}

function displayData(map, filterId = 'all') {
  
  clearMap(map)

  if(data.value) map.value.data.addGeoJson(data.value);

  if(dataMap.value){
    if(filterId === 'all')
      for (const fId in dataMap.value)
        map.value.data.addGeoJson(dataMap.value[fId]);
    else
      map.value.data.addGeoJson(dataMap.value[filterId]);
  }

  listener.value.push(map.value.data.addListener('click', setInfoWindow));

  setTimeout(()=> isLoaded.value = true, 1500)
}

function displayArchiveData(map, filterId = 'all') {
  
  clearMap(map, true)

  if(archives.value?.data) map.value.data.addGeoJson(archives.value.data);

  if(archives.value?.dataMap){
    if(filterId === 'all')
      for (const fId in archives.value?.dataMap)
        map.value.data.addGeoJson(archives.value?.dataMap[fId]);

    else
      map.value.data.addGeoJson(archives.value?.dataMap[filterId]);

      applyStyles(map);
  }

  listener.value.push(map.value.data.addListener('click', setInfoWindow));

  setTimeout(()=> isLoaded.value = true, 1500)
}

function setInfoWindow(event) {
    const record  = event.feature.getProperty('__record');
    const tryI18n = record.tryI18n;
    const title   = tryI18n ? t(record.identifier) : record.title;
    const summary = (tryI18n ? t(`${record.identifier}-DESC`) : record.description).replace(/\r\n|\r|\n/g, '<br />');
    const region  = record?.region? `<em class="badge bg-info">${t(record?.region?.identifier)}</em>` : '';
    const archive = record?.archive? `<span class="badge bg-danger">${t('Archived')}</span>` : '';
    const content =
        `<div id="infoBox" class="scrollFix">
            <h4>${title}</h4>
            <p style="white-space:normal">${summary}</p>
            <a class="float-end" target="ebsa" href="${record.url}">${t('Details')} »</a>
            ${region}${archive}
        </div>`;

  infoWindow.value.setContent(content);
  infoWindow.value.setPosition(event.latLng);
  infoWindow.value.open(mainMap.value);
}



function cleanupListeners(googleMaps, map, ) {
  if(listener.value?.length)
    for (const l of listener.value) 
        googleMaps.value.event.removeListener(l);
    
    googleMaps.value?.event?.clearInstanceListeners(window);
    googleMaps.value?.event?.clearInstanceListeners(window?.document);
    googleMaps.value?.event?.clearInstanceListeners(map.value);
}

function clearMap(map, archives = false) {
  if (infoWindow.value.getMap()) 
    infoWindow.value.close();

    if(archives)
      map.value.data.forEach((feature) => isFeatureArchived(feature)? map.value.data.remove(feature) : '');
    else
      map.value.data.forEach((feature) => !isFeatureArchived(feature)? map.value.data.remove(feature) : '');
}

function isFeatureArchived(feature) {
  return !!feature.Fg?.archive ;
}

function addArchiveControl(map) {
  if(hasArchives.value)
    map.value.controls[googleMapsApi.value.ControlPosition.TOP_LEFT].push(createSwitch());
}

function createSwitch() {

    const containerDiv = document.createElement('div');

    containerDiv.className = 'card px-2 pt-2 mt-2';
    // Create the form control div element
    const div = document.createElement('div');

    div.className = 'form-check form-switch';

    // Create the input element
    const input = document.createElement('input');
    input.className = 'form-check-input';
    input.type      = 'checkbox';
    input.id        = 'flexSwitchCheckDefault';

    // Create the label element
    const label = document.createElement('label');

    label.className   = 'form-check-label';
    label.htmlFor     = 'flexSwitchCheckDefault';
    label.textContent = t('Show Archives');

    // Append the input and label to the div
    div.appendChild(input);
    div.appendChild(label);
    containerDiv.appendChild(div);
    input.addEventListener('change', (e) => { 
      
      nextTick(()=> {
        isLoaded.value = false;
        showArchives.value = e.target.checked;
        if(!e.target.checked) setTimeout(()=> isLoaded.value = true, 1500)
    });

    });

    return containerDiv;
}
</script>

<style>
.regions{
  background-color: #E6E6E6;
}
.region{
  background-color: #E6E6E6;
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
  color:#247080;
  cursor: pointer;
}
.region:hover{
  
  font-weight: bold;
}
.region.selected{
  font-weight: bold;
  color:#247080 !important;

}
.map-frame {
    width: 100%;
    height: 100%;
    position: relative;
}

.map-content {
    z-index: 10;
    position: absolute;
    top: 50px;
    left: 50px;
    width: 390px;
    background-color: black;
    color: #FFF;
}
</style>