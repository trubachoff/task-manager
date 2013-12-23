'use strict';

// Main app module
var taskmgr = angular.module('taskmgr', []);

// Main app controller
taskmgr.controller('TaskCtrl', function TaskCtrl($scope, $location, taskStorage, filterFilter) {
	var tasks = $scope.tasks = taskStorage.get();

	$scope.newTitle = '';
	$scope.newDesc = '';
	$scope.editedTask = null;

	$scope.$watch('tasks', function (newValue, oldValue) {
		$scope.remainingCount = filterFilter(tasks, { completed: false }).length;
		$scope.completedCount = tasks.length - $scope.remainingCount;
		$scope.allChecked = !$scope.remainingCount;
		if (newValue !== oldValue) {
			taskStorage.put(tasks);
		}
	}, true);

	if ($location.path() === '') {
		$location.path('/');
	}

	$scope.location = $location;

	$scope.$watch('location.path()', function(path) {
		if (path === '/active') {
			$scope.statusFilter = {"completed": false};
		} else if (path === '/completed') {
			$scope.statusFilter = {"completed": true};
		} else {
			$scope.statusFilter = null;
		}
	});

	$scope.addTask = function() {
		var newTitle = $scope.newTitle;
		var newDesc = $scope.newDesc.trim();
		tasks.push({
			title: newTitle,
			description: newDesc,
			completed: false
		});

		$scope.newTitle = '';
		$scope.newDesc = '';
	}

	$scope.clearCompletedTask = function() {
		$scope.tasks = tasks = tasks.filter(function (val) {
			return !val.completed;
		});
	};	

	$scope.removeTask = function(task) {
		tasks.splice(tasks.indexOf(task), 1);
	};	

	$scope.editTask = function(task) {
		$scope.editedTask = task;
		$scope.origTask = angular.extend({}, task);
	};

	$scope.doneEditing = function (task) {
		$scope.editedTask = null;
		task.title = task.title.trim();
	};	

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