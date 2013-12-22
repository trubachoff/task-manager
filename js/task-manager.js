'use strict';

// Main app module
var taskmgr = angular.module('taskmgr', []);

// Main app controller
taskmgr.controller('TaskCtrl', function TaskCtrl($scope, taskStorage) {
	var tasks = $scope.tasks = taskStorage.get();

	$scope.newTask = '';
	$scope.editedTask = null;
});

// Local sorage service
taskmgr.factory('taskStorage', function() {
	var STORAGE_ID = 'task-manager';

	return {
		get: function() {
			return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
		},
		put: function(tasks) {
			localStorage.setItem(STORAGE_ID, JSON.stringify(tasks));
		}
	};
});