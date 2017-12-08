// service for page: fairlocation
/// <reference path="~/www/lib/convey/scripts/strings.js" />
/// <reference path="~/www/lib/convey/scripts/logging.js" />
/// <reference path="~/www/lib/convey/scripts/dataService.js" />

(function () {
    "use strict";

    WinJS.Namespace.define("Fairlocation", {
        _initView: {
            get: function () {
                return AppData.getLgntInit("LGNTINITFairLocation");
            }
        },
        _formatView: {
            get: function () {
                return AppData.getFormatView("LGNTINITFairLocation", 20520);
            }
        }
    });
    WinJS.Namespace.define("Fairlocation", {
        initView: {
            clear: function() {
                Fairlocation._initView.clear();
            },
            select: function (complete, error, restriction) {
                var ret;
                Log.call(Log.l.trace, "Fairlocation.initView.");
                if (typeof restriction === "number") {
                    Log.print(Log.l.trace, "calling selectById... recordId=" + restriction);
                    ret = Fairlocation._formatView.selectById(complete, error, restriction);
                } else {
                    // add language restriction in format view!
                    if (!restriction) {
                        restriction = {};
                    }
                    restriction.LanguageSpecID = AppData.getLanguageId();
                    Log.print(Log.l.trace, "calling select... LanguageSpecID=" + restriction.LanguageSpecID);
                    ret = Fairlocation._formatView.select(complete, error, restriction, {
                        ordered: true,
                        orderAttribute: "TITLE"
                    });
                }
                Log.ret(Log.l.trace);
                return ret;
            },
            deleteRecord: function (complete, error, recordId) {
                Log.call(Log.l.trace, "Fairlocation.initView.");
                var ret = Fairlocation._initView.deleteRecord(function () {
                    if (typeof complete === "function") {
                        complete();
                    }
                }, error, recordId);
                Log.ret(Log.l.trace);
                return ret;
            },
            update: function (complete, error, recordId, viewResponse) {
                Log.call(Log.l.trace, "Fairlocation.initView.");
                var ret = Fairlocation._initView.update(function () {
                    if (typeof complete === "function") {
                        complete();
                    }
                }, error, recordId, viewResponse);
                Log.ret(Log.l.trace);
                return ret;
            },
            insert: function (complete, error) {
                Log.call(Log.l.trace, "Fairlocation.initView.");
                var ret = Fairlocation._initView.insert(function () {
                    if (typeof complete === "function") {
                        complete();
                    }
                }, error, {
                    FragengruppeID: 0
                });
                Log.ret(Log.l.trace);
                return ret;
            },
            getNextUrl: function (response) {
                Log.call(Log.l.trace, "Fairlocation.initView.");
                var ret = Fairlocation._formatView.getNextUrl(response);
                Log.ret(Log.l.trace);
                return ret;
            },
            selectNext: function (complete, error, response, nextUrl) {
                Log.call(Log.l.trace, "Fairlocation.initView.");
                var ret = Fairlocation._formatView.selectNext(complete, error, response, nextUrl);
                // this will return a promise to controller
                Log.ret(Log.l.trace);
                return ret;
            },
            relationName: Fairlocation._initView.relationName,
            getRecordId: Fairlocation._initView.getRecordId
        }
    });
})();


