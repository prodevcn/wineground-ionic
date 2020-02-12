angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('search', {
    url: '/search',
    templateUrl: 'templates/search.html'
  })
  .state('store', {
    url: '/store',
    templateUrl: 'templates/store.html',
    controller: 'storeCtrl'
  })
  .state('grape', {
    url: '/grape',
    params: {
      grapeId: "{{grapeId}}"
    },
    templateUrl: 'templates/grape.html',
    controller: 'grapeCtrl'
  })
  .state('pairing', {
    url: '/pairing',
    params: {
      pairingId: "{{pairingId}}"
    },
    templateUrl: 'templates/pairing.html',
    controller: 'pairingCtrl'
  });

  $urlRouterProvider.otherwise('/search')

});
