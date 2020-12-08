angular.module('app.controllers', [])

.controller('indexCtrl', ['$state', '$ionicHistory', '$rootScope',
function ($state, $ionicHistory, $rootScope) {
  firebase.auth().onAuthStateChanged(function(user){
    if (user) {
      console.log('User logged in');
      $rootScope.noUser = false;
      $rootScope.userId = user.uid;
      firebase.database().ref('users/' + user.uid).once('value', function(snapshot){
        $rootScope.currentUser = snapshot.val();
      });
    } else {
      console.log('No user logged in');
      $rootScope.userId = null;
      $rootScope.noUser = true;
      $state.go('search');
    }
  });
  $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
    console.log("State Changed");
     if (from.url === '/search' || from.url === '/signUp'){
       $rootScope.fromSearch = true;
     } else {
       $rootScope.fromSearch = false;
     }
  });
  var productIds = ['gb001', 'gb002'];

  //Get all Products
  $rootScope.products = [
    {
      productId: 'gb001',
      title: 'Product 1',
      description: 'Product 1 description',
      price: '$0.99'
    },
    {
      productId: 'gb002',
      title: 'Product 2',
      description: 'Product 2 description',
      price: '$0.99'
    }
  ];
  //inAppPurchase.getProducts(productIds).then(function(products){
      //$rootScope.products = products;
    //}).catch(function(err){
      //console.log(err);
    //});
}])

.controller('storeCtrl', ['$scope', '$ionicHistory',
function($scope, $ionicHistory){
  $scope.goBack = function(){
    $ionicHistory.goBack();
  };
}])

.controller('productCtrl', ['$scope',
function($scope) {
  firebase.database().ref('products/' + $scope.product.productId).once('value', function(snapshot){
    $scope.image = snapshot.val().image;
  });
}])

.controller('searchCtrl', ['$scope', '$state', '$firebaseArray', '$timeout', '$q', '$log',
function ($scope, $state, $firebaseArray, $timeout, $q, $log) {
  $scope.signInNav = function(){
    $state.go('signIn');
  };
  $scope.homeNav = function(){
    $state.go('tabs.home');
  };
  $scope.storeNav = function(){
    $state.go('store');
  };
  $scope.submitting = false;
  $scope.searchQuery = {};
  $scope.search = function(){
    $scope.submitting = true;
    if ($scope.searchQuery.type === 'grape') {
      $scope.data = {
        grapeId: $scope.searchQuery.sid
      };
      $state.go('grape', $scope.data);
      $scope.submitting = false;
    } else if ($scope.searchQuery.type === 'pairing') {
      $scope.data = {
        pairingId: $scope.searchQuery.sid
      };
      $state.go('pairing', $scope.data);
      $scope.submitting = false;
    } else {
      $scope.submitting = false;
      return;
    }
  };
  var self = this;
  self.items = loadAll();
  self.querySearch = querySearch;
  self.selectedItemChange = selectedItemChange;

  function selectedItemChange(item) {
    if (item !== undefined) {
      $scope.searchQuery = {
        sid: item.searchId,
        type: item.type
      };
    } else {
      $scope.searchQuery = {};
      return;
    }
  }

  function querySearch (query) {
    var results = query ? self.items.filter(createFilterFor(query)) : self.items,
      deferred;
    return results;
  }

  function createFilterFor(query) {
    var lowercaseQuery = query.toLowerCase();

    return function filterFn(item) {
      return (item.term.indexOf(lowercaseQuery) === 0);
    };
  }

  function loadAll() {
    console.log("Loading All Items");
    var ref = firebase.database().ref('search');
    var allItems = $firebaseArray(ref);
    return allItems;
  }
}])

.controller('grapeCtrl', ['$scope', '$ionicHistory', '$stateParams', '$firebaseArray',
function ($scope, $ionicHistory, $stateParams, $firebaseArray) {
  $scope.goBack = function(){
    $ionicHistory.goBack();
  };
  var gid = $stateParams.grapeId;
  var exp = firebase.database().ref('varietals/' + gid + '/pairings');
  $scope.l3s = $firebaseArray(exp);
}])

.controller('pairingCtrl', ['$scope', '$ionicHistory', '$stateParams', '$firebaseArray',
function ($scope, $ionicHistory, $stateParams, $firebaseArray) {
  $scope.goBack = function(){
    $ionicHistory.goBack();
  };
  var pid = $stateParams.pairingId;
  var exp = firebase.database().ref('pairings/' + pid + '/grapes');
  $scope.l3s = $firebaseArray(exp);
}])

.controller('l3GrapeCtrl', ['$scope',
function($scope) {
  firebase.database().ref('pairings/' + $scope.l3.$id).once('value', function(snapshot){
    $scope.pairing = snapshot.val();
  }).then(function(){
    firebase.database().ref('foodtypes/' + $scope.pairing.category + '/name').once('value', function(snapshot){
      $scope.category = snapshot.val();
    });
  });
}])

.controller('l2GrapeCtrl', ['$scope',
function($scope) {
  firebase.database().ref('pairings/' + $scope.l2.$id).once('value', function(snapshot){
    $scope.pairing = snapshot.val();
  }).then(function(){
    firebase.database().ref('foodtypes/' + $scope.pairing.category + '/name').once('value', function(snapshot){
      $scope.category = snapshot.val();
    });
  });
}])

.controller('l0GrapeCtrl', ['$scope',
function($scope) {
  firebase.database().ref('pairings/' + $scope.l0.$id).once('value', function(snapshot){
    $scope.pairing = snapshot.val();
  }).then(function(){
    firebase.database().ref('foodtypes/' + $scope.pairing.category + '/name').once('value', function(snapshot){
      $scope.category = snapshot.val();
    });
  });
}])

.controller('l3PairingCtrl', ['$scope',
function($scope) {
  firebase.database().ref('varietals/' + $scope.l3.$id).once('value', function(snapshot){
    $scope.grape = snapshot.val();
  });
}])

.controller('l2PairingCtrl', ['$scope',
function($scope) {
  firebase.database().ref('pairings/' + $scope.l2.$id).once('value', function(snapshot){
    $scope.grape = snapshot.val();
  });
}])

.controller('l0PairingCtrl', ['$scope',
function($scope) {
  firebase.database().ref('pairings/' + $scope.l0.$id).once('value', function(snapshot){
    $scope.grape = snapshot.val();
  });
}])

.controller('varietalCtrl', ['$scope',
function($scope) {
  firebase.database().ref('varietals').orderByChild('grape').equalTo($scope.wine.varietal).once('value', function(snapshot){
    $scope.varietal = snapshot.val();
  });
}]);
