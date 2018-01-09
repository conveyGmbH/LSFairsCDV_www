// service for page: registration
/// <reference path="~/www/lib/convey/scripts/strings.js" />
/// <reference path="~/www/lib/convey/scripts/logging.js" />
/// <reference path="~/www/lib/convey/scripts/dataService.js" />


(function () {
    "use strict";

    WinJS.Namespace.define("Registration", {
        _registrationView: {
            get: function () {
                var ret = AppData.getFormatView("Mitarbeiter_Anschrift", 20524, false);
                return ret;
            }
        },
        registrationView: {
            select: function (complete, error, restriction) {
                Log.call(Log.l.trace, "Registration.");
                var ret = Registration._registrationView.select(complete, error, restriction, {
                    ordered: true,
                    orderAttribute: "RegistrierungBestaetigt",
                    desc: true
                });
                // this will return a promise to controller
                Log.ret(Log.l.trace);
                return ret;
            },
            getNextUrl: function (response) {
                Log.call(Log.l.trace, "Registration.");
                var ret = Registration._registrationView.getNextUrl(response);
                Log.ret(Log.l.trace);
                return ret;
            },
            selectNext: function (complete, error, response, nextUrl) {
                Log.call(Log.l.trace, "Registration.");
                var ret = Registration._registrationView.selectNext(complete, error, response, nextUrl);
                // this will return a promise to controller
                Log.ret(Log.l.trace);
                return ret;
            },
            getDbView: function () {
                return Registration._registrationView;
            }
        }
    });
})();

