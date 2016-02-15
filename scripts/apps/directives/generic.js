define(['app'], function(app) {
    app.directive('outsideclick', ['$document', function($document) {
        return {
            restrict: 'A',
            link: function(scope, elem, attr, ctrl) {
                elem.bind('click', function(e) {
                    e.stopPropagation();
                });
                $document.bind('click', function(e) {
                    scope.$apply(attr.outsideclick);
                });
            }
        };
    }]);

    app.directive('outsideclickmenu', ['$document', function($document) {
        return {
            restrict: 'A',
            link: function(scope, elem, attr, ctrl) {
                elem.bind('click', function(e) {
                    e.stopPropagation();
                });
                $document.bind('click', function(e) {
                    scope.$apply(attr.outsideclickmenu);
                });
            }
        };
    }]);

    app.directive('search', [
        '$document', '$location', '$timeout',
        function($document, $location, $timeout) {
            return {
                require: 'ngModel',
                link: function(scope, elem, attr, ctrl) {
                    elem.bind('keyup', function(event) {
                        var keycode = (event.which) ? event.which : event.keyCode;
                        if (keycode == 13 && elem.val().length >= 3) {
                            scope.handleSearchKeyEnter();
                        }
                    });
                }
            };
        }
    ]);

    app.directive('searchBtn', [
        '$document', '$location', '$timeout',
        function($document, $location, $timeout) {
            return {
                link: function(scope, elem, attr, ctrl) {
                    elem.bind('click', function(event) {
                        if (angular.element(".search-bar").val().length > 2) {
                            scope.handleSearchKeyEnter();
                        }
                    });
                }
            };
        }
    ]);

    app.directive('back', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.bind('click', function() {
                    $window.history.back();
                });
            }
        };
    }]);

    app.directive('myMaxLength', [function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, controller) {
                var maxlength = Number(attrs.myMaxLength);
                controller.$parsers.push(function(inputValue) {
                    if (inputValue == undefined) return '';
                    if (inputValue.length > maxlength) {
                        var transformedInput = inputValue.substring(0, maxlength);
                        controller.$setViewValue(transformedInput);
                        controller.$render();
                        return transformedInput;
                    }
                    return inputValue;
                });
            }
        };
    }]);

    app.directive('myMinLength', [function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, controller) {
                var minlength = Number(attrs.myMinLength);
                controller.$parsers.push(function(inputValue) {
                    if (inputValue == undefined) return '';
                    if (inputValue.length < minlength) {
                        var transformedInput = inputValue.substring(0, minlength);
                        controller.$setViewValue(transformedInput);
                        controller.$render();
                        return transformedInput;
                    }
                    return inputValue;
                });
            }
        };
    }]);

    app.directive('onlyDigits', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');

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

    app.directive('onlyAlphabets', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^a-zA-Z]/g, '');

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

    app.directive('onlyAlphabetsWithSpace', [
        function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, modelCtrl) {
                    modelCtrl.$parsers.push(function(inputValue) {
                        // this next if is necessary for when using ng-required on your input. 
                        // In such cases, when a letter is typed first, this parser will be called
                        // again, and the 2nd time, the value will be undefined

                        if (inputValue == undefined) return '';
                        var transformedInput = inputValue.replace(/[^a-zA-Z\s]/g, '');
                        if (transformedInput != inputValue) {
                            modelCtrl.$setViewValue(transformedInput);
                            modelCtrl.$render();
                        }

                        element.bind('blur', function(event) {
                            var fieldValue = element.val();
                            fieldValue = fieldValue.replace(/^\s+|\s+$/g, '');
                            element.val(fieldValue);
                        });

                        return transformedInput;
                    });

                }
            };
        }
    ]);
	
	app.directive('onlyAlphanumericWithSpace', [
        function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, modelCtrl) {
                    modelCtrl.$parsers.push(function(inputValue) {
                        // this next if is necessary for when using ng-required on your input. 
                        // In such cases, when a letter is typed first, this parser will be called
                        // again, and the 2nd time, the value will be undefined

                        if (inputValue == undefined) return '';
                        var transformedInput = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');///^[a-zA-Z0-9]*$/
                        if (transformedInput != inputValue) {
                            modelCtrl.$setViewValue(transformedInput);
                            modelCtrl.$render();
                        }

                        element.bind('blur', function(event) {
                            var fieldValue = element.val();
                            fieldValue = fieldValue.replace(/^\s+|\s+$/g, '');
                            element.val(fieldValue);
                        });

                        return transformedInput;
                    });

                }
            };
        }
    ]);

    app.directive('validateEmail', function() {
        var EMAIL_REGEXP = /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;

        return {
            require: 'ngModel',
            restrict: '',
            link: function(scope, elm, attrs, ctrl) {
                // only apply the validator if ngModel is present and Angular has added the email validator
                if (ctrl && ctrl.$validators.email) {
                    // this will overwrite the default Angular email validator
                    ctrl.$validators.email = function(modelValue) {
                        return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                    };
                }
            }
        };
    });
});
