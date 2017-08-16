var materialAdmin = angular.module('materialAdmin', [
    'ngAnimate',
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'oc.lazyLoad',
    'nouislider',
    'ngTable'
])

materialAdmin.directive('myRequired', function () {
    return {
    	 restrict: 'AE',
         scope: {},
         require: 'ngModel',
        link: function (scope, iElement, iAttrs) {if(iElement.val() == ""){
            //do something
            return;
        } else {
            //do other things
        }}
    };
});

materialAdmin.directive('formvalidation', function (e) {
     var fieldId = e.target.attributes.id.value;
     var maxLength = e.target.attributes.maxlength.value;
     
     if (fieldId == 'phone' || fieldId == 'zip' || fieldId == 'fax') {
         var targetVal = $('#' + fieldId).val();
         $('#' + fieldId).val(targetVal.replace(/[^0-9]/g, ''));
         
         var valLength = $('#' + fieldId).val().length;
         if (valLength < maxLength) {
             $('#' + fieldId).addClass('failedCheck inputError ');
         } else {
             $('#' + fieldId).removeClass('failedCheck').removeClass('inputError ');
         }
     }else if(fieldId == 'email'){
         var checkMatch = $('#'+fieldId).val().match(/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/);
         if(!checkMatch){
             $('#'+fieldId).addClass('failedCheck inputError ');
         }else{
             $('#'+fieldId).removeClass('failedCheck').removeClass('inputError ');
         }
     }
 });

materialAdmin.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^1-9][^0-9]/g, '');
                    if(parseInt(transformedInput)>20 ||parseInt(transformedInput)<1){
                    	ngModelCtrl.$setViewValue('');
                        ngModelCtrl.$render();
                    }
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
 