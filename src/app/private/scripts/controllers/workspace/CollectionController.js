'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:collectionController
 * @author Harish Kumar Gangula
 * @description
 * # collectionController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('CollectionController', function(contentService, $timeout, $state, config, $rootScope, ToasterService) {

        var collection = this;
        collection.lessonTypes = config.DROPDOWN.COMMON.lessonTypes;
        collection.audiences = config.DROPDOWN.COMMON.audiences;
        collection.languages = config.DROPDOWN.COMMON.languages;
        collection.grades = config.DROPDOWN.COMMON.grades;
        collection.ageGroup = config.DROPDOWN.COMMON.ageGroup;
        collection.mediums = config.DROPDOWN.COMMON.medium;
        collection.subjects = config.DROPDOWN.COMMON.subjects;
        collection.boards = config.DROPDOWN.COMMON.boards;
        collection.showCreateSlideShowModal = false;
        collection.slideShowCreated = false;
        collection.userId = $rootScope.userId;
        collection.accept = false;

        collection.hideCreateSlideShowModal = function() {
            $('#createSlideShowModal')
                .modal('hide');
            $('#createSlideShowModal')
                .modal('hide others');
            $('#createSlideShowModal')
                .modal('hide dimmer');
        };

        collection.initilizeView = function() {
            collection.showCreateSlideShowModal = true;
            $timeout(function() {
                $('.multiSelectDropDown')
                    .dropdown();
                $('.singleSelectDropDown')
                    .dropdown();
                $('#createSlideShowModal').modal({
                    onHide: function() {
                        collection.clearCreateSlideShowData();
                        if (!collection.slideShowCreated) {
                            $state.go("WorkSpace.ContentCreation");
                        }
                    }
                }).modal('show');
            }, 10);
        };

        collection.createContent = function(requestData) {

            contentService.create(requestData).then(function(res) {
                if (res && res.responseCode === "OK") {
                    collection.slideShowCreated = true;
                    collection.showCreateSlideShowModal = false;
                    collection.loader.showLoader = false;
                    collection.hideCreateSlideShowModal();
                    collection.initEKStepCE(res.result.content_id);

                } else {
                    collection.loader.showLoader = false;
                    ToasterService.error($rootScope.errorMessages.WORKSPACE.CREATE_COLLECTION.FAILED);
                }
            }).catch(function (error){
                collection.loader.showLoader = false;
                ToasterService.error($rootScope.errorMessages.WORKSPACE.CREATE_COLLECTION.FAILED);
            });
        };

        collection.saveMetaData = function(data) {

            collection.loader = ToasterService.loader("", $rootScope.errorMessages.WORKSPACE.CREATE_COLLECTION.START);

            var requestBody = angular.copy(data);

            requestBody.mimeType = "application/vnd.ekstep.content-collection";
            requestBody.createdBy = collection.userId;

            requestBody.name = requestBody.name ? requestBody.name : "Untitled collection";
            requestBody.description = requestBody.description ? requestBody.description : "Description";
            requestBody.contentType = "Collection";

            var requestdata = {
                "content": requestBody
            };
            collection.createContent(requestdata);
        };

        collection.clearCreateSlideShowData = function() {
            collection.data = {};
        };

        collection.initEKStepCE = function(contentId) {
            var params = { contentId: contentId ,type: "Collection"};
            $state.go("CollectionEditor", params);
        };
    });