// controller for page: start
/// <reference path="~/www/lib/convey/scripts/logging.js" />
/// <reference path="~/www/lib/convey/scripts/appSettings.js" />
/// <reference path="~/www/lib/convey/scripts/dataService.js" />
/// <reference path="~/www/lib/convey/scripts/appbar.js" />
/// <reference path="~/www/lib/convey/scripts/pageController.js" />
/// <reference path="~/www/scripts/generalData.js" />
/// <reference path="~/www/pages/start/startService.js" />

/*
 Structure of states to be set from external modules:
 {
    networkState: newNetworkstate:
 }
*/

(function () {
    "use strict";

    WinJS.Namespace.define("Start", {
        Controller: WinJS.Class.derive(Application.Controller, function Controller(pageElement, commandList) {
            Log.call(Log.l.trace, "Start.Controller.");
            Application.Controller.apply(this, [pageElement, {
                dataStart: {},
                comment: getResourceText("info.comment")
            }, commandList]);

            var that = this;

            this.dispose = function () {
            }


            var setLabelColor = function(element, labelClass, color) {
                var labels = element.querySelectorAll("." + labelClass);
                for (var i = 0; i < labels.length; i++) {
                    var label = labels[i];
                    if (label && label.style) {
                        label.style.color = color;
                    }
                }
            }
            this.setLabelColor = setLabelColor;


            // define handlers
            this.eventHandlers = {
                clickBack: function (event) {
                    Log.call(Log.l.trace, "Settings.Controller.");
                    if (WinJS.Navigation.canGoBack === true) {
                        WinJS.Navigation.back(1).done( /* Your success and error handlers */);
                    }
                    Log.ret(Log.l.trace);
                },
                clickChangeUserState: function (event) {
                    Log.call(Log.l.trace, "Start.Controller.");
                    Application.navigateById("userinfo", event);
                    Log.ret(Log.l.trace);
                }
            };

            this.disableHandlers = {
                clickBack: function() {
                    if (WinJS.Navigation.canGoBack === true) {
                        return false;
                    } else {
                        return true;
                    }
                }
            };

            // finally, load the data
            that.processAll().then(function() {
            }).then(function () {
                Log.print(Log.l.trace, "Binding wireup page complete, now bind list");
            });
            Log.ret(Log.l.trace);
        })
    });
})();







