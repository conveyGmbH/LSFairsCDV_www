// service for page: faircategory
/// <reference path="~/www/lib/convey/scripts/strings.js" />
/// <reference path="~/www/lib/convey/scripts/logging.js" />
/// <reference path="~/www/lib/convey/scripts/dataService.js" />

(function () {
    "use strict";

    WinJS.Namespace.define("Faircategory", {
        _initView: {
            get: function () {
                return AppData.getLgntInit("LGNTINITFairCategory");
            }
        },
        _formatView: {
            get: function () {
                return AppData.getFormatView("LGNTINITFairCategory", 20510);
            }
        }
    });
    WinJS.Namespace.define("Faircategory", {
        initView: {
            clear: function() {
                Faircategory._initView.clear();
            },
            select: function (complete, error, restriction) {
                var ret;
                Log.call(Log.l.trace, "Faircategory.initView.");
                if (typeof restriction === "number") {
                    Log.print(Log.l.trace, "calling selectById... recordId=" + restriction);
                    ret = Faircategory._formatView.selectById(complete, error, restriction);
                } else {
                    // add language restriction in format view!
                    if (!restriction) {
                        restriction = {};
                    }
                    restriction.LanguageSpecID = AppData.getLanguageId();
                    Log.print(Log.l.trace, "calling select... LanguageSpecID=" + restriction.LanguageSpecID);
                    ret = Faircategory._formatView.select(complete, error, restriction, {
                        ordered: true,
                        orderAttribute: "TITLE"
                    });
                }
                Log.ret(Log.l.trace);
                return ret;
            },
            deleteRecord: function (complete, error, recordId) {
                Log.call(Log.l.trace, "Faircategory.initView.");
                var ret = Faircategory._initView.deleteRecord(function () {
                    if (typeof complete === "function") {
                        complete();
                    }
                }, error, recordId);
                Log.ret(Log.l.trace);
                return ret;
            },
            update: function (complete, error, recordId, viewResponse) {
                Log.call(Log.l.trace, "Faircategory.initView.");
                var ret = Faircategory._initView.update(function () {
                    if (typeof complete === "function") {
                        complete();
                    }
                }, error, recordId, viewResponse);
                Log.ret(Log.l.trace);
                return ret;
            },
            insert: function (complete, error) {
                Log.call(Log.l.trace, "Faircategory.initView.");
                var ret = Faircategory._initView.insert(function () {
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
                Log.call(Log.l.trace, "Faircategory.initView.");
                var ret = Faircategory._formatView.getNextUrl(response);
                Log.ret(Log.l.trace);
                return ret;
            },
            selectNext: function (complete, error, response, nextUrl) {
                Log.call(Log.l.trace, "Faircategory.initView.");
                var ret = Faircategory._formatView.selectNext(complete, error, response, nextUrl);
                // this will return a promise to controller
                Log.ret(Log.l.trace);
                return ret;
            },
            relationName: Faircategory._initView.relationName,
            getRecordId: Faircategory._initView.getRecordId
        }
    });
})();


