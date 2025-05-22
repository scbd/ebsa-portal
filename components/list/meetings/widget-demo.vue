<template>
    <div class="row">
        <div v-if="future.meetings.length"  :class="{'col-12':!past.meetings.length, 'col-6':past.meetings.length}"> 
            <table class="ebsa-table table table-striped">
                <thead>
                    <th><img src="/img/icon-home.png" alt="meeting icon" /> {{t('Upcoming Meetings')}}</th>
                    <th>
                    <div class="push5"></div><div class="push5"></div>
                    <!-- <a class="important blue4 float-end" href="#">{{t('More')}} »</a> -->
                    </th>
                </thead>

                <tr v-if="!future.meetings.length">
                    <td colspan="2">{{t('No meetings')}}...</td>
                </tr>

                <tr v-for="meeting in future.meetings">
                    <td><h4 style="background-color:transparent !important;">{{meeting?.title}}</h4></td>
                    <td>
                        <a  style="background-color:transparent !important;" :href="meeting.documentsUrl" target="_blank" class="float-end">{{t('Documents')}} »</a>
                    </td>
                </tr>

            </table>
        </div>
        <div v-if="past.meetings.length"  :class="{'col-12':!future.meetings.length, 'col-6':future.meetings.length}">
            <table class="ebsa-table table table-striped">
                <thead>
                    <th><img src="/img/icon-home.png" alt="meeting icon" />  {{t('Previous Meetings')}}</th>
                    <th>
                    <div class="push5"></div><div class="push5"></div>
                    <!-- <a class="important blue4 float-end" href="#">{{t('More')}} »</a> -->
                    </th>
                </thead>

                <tr v-if="!past.meetings.length">
                    <td colspan="2">{{t('No meetings')}}...</td>
                </tr>

                <tr v-for="meeting in past.meetings">
                    <td style="background-color:transparent !important;"><h4 style="background-color:transparent !important;">{{meeting?.title}}</h4></td>
                    <td>
                        <a  style="background-color:transparent !important;" :href="meeting.documentsUrl" target="_blank" class="pull-right">{{t('Documents')}} »</a>
                    </td>
                </tr>

            </table>
        </div>
    </div>
</template>
<script setup>
const { t } = useI18n();

const getMeetings = useMeetings();

const { data:future} = await getMeetings(ref(3),ref(),ref(),ref('past'));


const { data:past} = await getMeetings(ref(0),ref(),ref(),ref('past'));
</script>