define([
    'app',
    'underscore'
  ],
  function(app, _) {
    'use strict';

    app.controller('MeetingsCtrl', [
      '$http', '$scope', '$locale', '$location', 'meetings', 'lists', 'paginator',
      function($http, $scope, $locale, $location, Meetings, Lists, paginator) {
        // The initial call to fetchMeetings() is triggered by the showtab
        // directive which has $scope.setTimeframe assigned to it's onclick
        // event handler. When the page loads showtab will select the proper
        // tab and execute it's onclick if there is one.
        // See meetings.html, line 12.
        var self = this;
        // default timeframe for meetings
        $scope.timeframe = 'upcoming';

        var firstLoad = true;


        self.filters = {
          country: undefined,
          year: undefined
        };

        this.resetFilters = function() {
          self.filters.country = self.filters.year = undefined;
        };

        $scope.setFilter = function(filterName, selection) {
          self.filters[filterName] = selection.value === 'All' ? undefined : selection.value;
          self.updateMeetingData(self.filterMeetings(self.filters));
        };

        this.filterMeetings = function(filters) {
          var filtered,
            meetings = self.meetingsCache[$scope.timeframe];

          if (!filters.country && !filters.year) return meetings;
          filtered = meetings;

          if (filters.country) {
            filtered = meetings.filter(function(meeting) {
              return meeting.countryCode === filters.country;
            });
          }
          if (filters.year) {
            filtered = filtered.filter(function(meeting) {
              return meeting.startYear === filters.year;
            });
          }
          return filtered;
        };

        $scope.setPage = function(page) {
          paginator.setPage(page);
          self.updateMeetingData();
        };

        $scope.setTimeframe = function(timeframe) {
          timeframe = timeframe || 'upcoming';
          self.resetFilters();
          $scope.timeframe = timeframe;
          self.fetchMeetings(timeframe);
        };

        this.generateCountryList = function(meetings) {

          function genList(countries) {
            var filteredCountries,
              filteredCodes = _.intersection(
                _.pluck(meetings, 'countryCode'),
                _.pluck(self.countriesCache, 'countryCode')
              );

            return _.chain(self.countriesCache)
              .filter(function(country) {
                return _.indexOf(filteredCodes, country.countryCode) !== -1;
              })
              .unshift({name: 'All', countryCode: 'All'})
              .map(function(country) {
                return {
                  text: country.name,
                  value: country.countryCode
                };
              })
              .value();
          }

          return self.countriesCache ?
            genList(self.countriesCache) :
            Lists.getCountries()
              .then(function(countries) {
                self.countriesCache = countries;
                $scope.countryList = genList(self.countriesCache);
              });
        };

        this.generateYearList = function(meetings) {
          var yearList = meetings.map(function(meeting) {
            return meeting.startYear;
          });
          yearList.unshift('All');
          return _.uniq(yearList)
            .map(function(year) {
              return {
                text: year.toString(),
                value: year
              };
            });
        };

        this.updateOptionLists = function(meetingSet) {
          // Angular 1.2.0 no longer automatically unwraps promises so technically
          // assigning the possible promise from generateCountryList is useless here.
          // This line only works as expected when the function uses the cache and returns
          // a synchronous response.
          $scope.countryList = self.generateCountryList(meetingSet);
          $scope.yearList = self.generateYearList(meetingSet);
        };

        this.updateMeetingData = function(meetings) {
          if (meetings) paginator.resetCollection(meetings);
          var page = paginator.getCurrentPage();
          $scope.meetings = page.data;
          $scope.pagination = page.pagination;
        };

        this.meetingsCache = {};
        this.fetchMeetings = function(timeframe, country, year) {
          if (timeframe && self.meetingsCache[timeframe]) {
            self.updateOptionLists(self.meetingsCache[timeframe]);
            return self.updateMeetingData(self.meetingsCache[timeframe]);
          }

          $scope.loading = true;
          return Meetings.getMeetingsPage({
            timeframe: timeframe,
            countryCode: country,
            year: year
          })
            .then(function(meetingSet) {
              $scope.loading = false;

              if (!meetingSet.length && firstLoad) {
                $scope.setTimeframe('previous');
                return;
              }
              // cache the results since we ask the backend for all rows.
              self.meetingsCache[timeframe] = meetingSet;
              self.updateOptionLists(meetingSet);
              self.updateMeetingData(meetingSet);

              firstLoad = false;
            });
        };
      }
    ]);

  });