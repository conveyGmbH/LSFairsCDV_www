// service for page: account
/// <reference path="~/www/lib/convey/scripts/strings.js" />
/// <reference path="~/www/lib/convey/scripts/logging.js" />
/// <reference path="~/www/lib/convey/scripts/dataService.js" />

(function () {
    "use strict";

    WinJS.Namespace.define("Account", {
        _initSpracheView: {
            get: function () {
                return AppData.getLgntInit("LGNTINITSprache");
            }
        },
        initSpracheView: {
            select: function (complete, error, recordId) {
                Log.call(Log.l.trace, "AppData._initSpracheView.");
                var ret = Account._initSpracheView.select(complete, error, recordId, { ordered: true });
                Log.ret(Log.l.trace);
                return ret;
            },
            getResults: function () {
                Log.call(Log.l.trace, "AppData._initSpracheView.");
                var ret = Account._initSpracheView.results;
                Log.ret(Log.l.trace);
                return ret;
            },
            getMap: function () {
                Log.call(Log.l.trace, "AppData._initSpracheView.");
                var ret = Account._initSpracheView.map;
                Log.ret(Log.l.trace);
                return ret;
            }
        },
        _loginRequest: {
            get: function () {
                return AppData.getFormatView("LoginRequest", 0, false, true);
            }
        },
        loginRequest: {
            insert: function (complete, error, viewResponse) {
                Log.call(Log.l.trace, "loginView.");
                var ret = Account._loginRequest.insert(complete, error, viewResponse);
                Log.ret(Log.l.trace);
                return ret;
            }
        },
        _loginView: {
            get: function () {
                return AppData.getFormatView("Mitarbeiter_Anmeldung", 0, false, true);
            }
        },
        loginView: {
            insert: function (complete, error, viewResponse) {
                Log.call(Log.l.trace, "loginView.");
                var ret = Account._loginView.insert(complete, error, viewResponse);
                Log.ret(Log.l.trace);
                return ret;
            }
        },
        _appListSpecView: {
            get: function () {
                return AppData.getFormatView("AppListSpec", 20457);
            }
        },
        appListSpecView: {
            select: function (complete, error) {
                Log.call(Log.l.trace, "appListSpecView.");
                var ret = Account._appListSpecView.select(complete, error);

                // this will return a promise to controller
                Log.ret(Log.l.trace);
                return ret;
            }
        }
    });
})();
