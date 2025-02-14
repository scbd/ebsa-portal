<template>
  <div class="container" >
      <div class="row">
        <div class="col-4">
            <hr>
            <VueMultiselect
                            v-model         = "selectedYear"
                            :options        = "filters.pastYears"
                            :multiple       = "false"
                            :close-on-select= "true"
                            :placeholder     = "t('All years')"
                            label           = "title"
                            track-by        = "identifier"
                            />
            <hr>
                            <VueMultiselect
                            v-model         = "selectedCountry"
                            :options        = "filters.countries"
                            :multiple       = "false"
                            :close-on-select= "true"
                            :placeholder     = "t('All countries')"
                            label           = "name"
                            track-by        = "identifier"
                            />
                    <hr>
        </div>


        <div class="col-8 pt-3 position-relative">

          <Spinner v-if="loading" :size="300" :is-modal="true"/>
          <LazyListPager v-if="data.meetingsMap.length" :options="pager" class="float-end"/>
          <table v-if="!data.meetingsMap.length" class="table meeting-table mb-5 " >
            <tr>
              <th>{{ t('Date and Venue') }}</th>
              <th>{{t('Event')}}</th>
              <th class="right"></th>
            </tr>

            <tr >
              <td colspan="3">{{t('No meetings found')}}...</td>
            </tr>
          </table>

          <table class="table meeting-table mb-5 " v-for="[yearKey, year] in data.meetingsMap">
            <tr>
              <th>{{ t('Date and Venue') }}</th>
              <th>{{t('Event')}}</th>
              <th class="right">{{yearKey}}</th>
            </tr>

            <tr v-if="year.months.length === 0">
              <td colspan="3">{{t('No meetings found')}}...</td>
            </tr>

            <template v-for="[monthKey, month] in year.months">
              <tr class="month" >
                <td colspan="3">
                  <p class="important">{{getLocalizedMonth(monthKey,{ locale, length:'long'})}}</p>
                </td>
              </tr>

              <tr class="event" >
                <td colspan="3" class="meeting-list" >
                  <div v-for="meeting in month.meetings" class="d-inline-flex justify-content-between w-100 p-0">
                    <div class="meeting-row-one p-1">
                      <p>
                          <span class="text-nowrap">
                            {{meeting.startDay}} {{getLocalizedMonth(meeting.startMonth,{ locale })}} -
                            {{meeting.endDay}} {{getLocalizedMonth(meeting.endMonth,{ locale })}}
                          </span>
                          <br />

                          <span class="text-nowrap">
                            {{meeting.city}}, {{meeting.country}} 
                          </span>
                          <br>
                          {{meeting.startYear}}
                        </p>
                    </div>
                    <div class="meeting-row-two p-1">
                      <h4>{{meeting.title}}</h4>
                    </div>
                    <div class="meeting-row-three p-1 ">
                      <a v-if="meeting.documentsUrl" :href="meeting.documentsUrl" target="_blank" class="text-nowrap pull-right doc-url">{{t('Documents')}} »</a>
                    </div>
                  </div>

                </td>
              </tr>
            </template>
          </table>
        </div>

    </div>
  </div>

</template>

<script setup>

import VueMultiselect from 'vue-multiselect';

const   props     = defineProps({ type : { type: String, default: 'past'} });
const { type }    = toRefs(props);

const { t, locale }       = useI18n();
const   page              = ref(0); 
const   getMeetings       = useMeetings();
const   getMeetingFilters = useMeetingFilters();
const   selectedYear      = ref();
const   selectedCountry   = ref();
const   eventBus          = useEventBus();


const { data: filters }           = (await getMeetingFilters());
const { data, status, refresh }   = (await getMeetings(page, selectedCountry, selectedYear, type));// { future: true} 

const total   = computed(()=>data.value.total)
const pager   = ref({ total: total.value, page: page .value, perPage: 5 });
const loading = ref(false);

watch(status,()=>{
  loading.value = true;
  setTimeout(()=>loading.value = status.value === 'pending', 750);

})
eventBus.on('goToPage', async (p) => {
  page.value  = p;
  pager.value = { total: total.value, page: page.value, perPage: 5 };
});

</script>


<style scoped>
.meeting-list div:nth-child(odd) {
  background: #f1f1f1;
}
.meeting-row-one{
  width : 25%;
  background: none !important;
}
.meeting-row-three{
  width : 25%;
  background: none !important;
}
.meeting-row-two{
  width : 100%;
  background: none !important;
}
/* *
Meeting Table */
.meeting-table th:first-child {
  width: 135px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}
.meeting-table td:first-child {
  width: 155px;
}
.meeting-table td:last-child {
  width: 95px;
}
.meeting-table tr.month,
.meeting-table tr {
  background: rgb(255, 255, 255);
  border: none;
}
.meeting-table tr.event td {
  padding: 0px;
  margin: 0px;
}
.meeting-table tr.event td table {
  width: 100%;
}
.meeting-table tr.event td table tr td {
  padding: 5px;
  vertical-align: middle;
}
.meeting-table tr.event td table tr td h4 {
  margin-top: 5px;
  width: 279px;
}
.meeting-table .event tr:first-child {
  border-top: 1px solid #247080;
}
.meeting-table .event tr:last-child {
  border-bottom: 1px solid #247080;
}
.meeting-table tr.event td table tr:nth-child(2n+1) {
  background: rgb(241, 241, 241);
}
</style>