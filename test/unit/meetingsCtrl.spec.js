define([
    'angular',
    'app',
    'angular-mocks',
    '/views/meetings/meetings.html.js',
    'text!/base/test/unit/fixtures/meetings.json',
    'text!/langs/en/countries.json',
  ],
  function(angular, app, mocks, ctrl, fixtureMeetings, countryList) {
    describe('MeetingsCtrl', function() {

      var fixtures = JSON.parse(fixtureMeetings),
        upcomingMeetings = fixtures.upcoming,
        previousMeetings = fixtures.previous;

      countryList = JSON.parse(countryList);


      var scope, controller, timeout;
      beforeEach(function() {
        mocks.module('app');

        mocks.inject(function($q, $timeout, $http, $rootScope, $locale,
            $location, $controller, lists, paginator) {

          timeout = $timeout;

          var mockMeetings = {
            getMeetingsPage: function(options) {
              var deferred = $q.defer(),
                meetings = (options.timeframe === 'upcoming') ?
                  upcomingMeetings :
                  previousMeetings;

              $timeout(function() { deferred.resolve(meetings); }, 0);
              return deferred.promise;
            }
          };

          var mockLists = {
            getCountries: function(cb) {
              var deferred = $q.defer();
              $timeout(function() { deferred.resolve(countryList); }, 0);
              return deferred.promise;
            }
          };

          scope = $rootScope.$new();
          controller = $controller('MeetingsCtrl', {
            $http: $http,
            $scope: scope,
            $locale: $locale,
            $location: $location,
            meetings: mockMeetings,
            lists: mockLists,
            paginator: paginator
          });
        });
      });

      it('should have a default timeframe', function() {
        expect(scope.timeframe).to.eql('upcoming');
      });

      it('should set filter when calling setFilter()', function() {
        var promise = controller.fetchMeetings({
          timeframe: 'upcoming'
        });
        // stub out update so we don't trigger requests.
        controller.updateMeetingData = sinon.stub().returns(undefined);
        controller.filterMeetings = sinon.stub().returns(undefined);
        controller.generateCountryList = sinon.stub().returns(undefined);
        controller.generateYearList = sinon.stub().returns(undefined);

        expect(scope.loading).to.be.true;
        timeout.flush();
        expect(scope.loading).to.be.false;

        scope.setFilter('country', {
          value: 'CA'
        });
        expect(controller.filters.country).to.eql('CA');
      });

      it('should return a list of conutries filtered by those that appear in the meeting set', function() {
        var list = controller.generateCountryList(upcomingMeetings);
        timeout.flush();

        expect(scope.countryList).to.deep.equal([{
          text: 'All',
          value: 'All'
        }, {
          text: 'Spain',
          value: 'ES'
        }]);
      });

      it('should return a list of years filtered by those that appear in the meeting set', function() {
        var list = controller.generateYearList(upcomingMeetings);
        expect(list).to.deep.equal([{
          text: 'All',
          value: 'All'
        }, {
          text: '2014',
          value: 2014
        }]);
      });
    });

  });