// service for page: fairmandantList
/// <reference path="~/www/lib/convey/scripts/strings.js" />
/// <reference path="~/www/lib/convey/scripts/logging.js" />
/// <reference path="~/www/lib/convey/scripts/dataService.js" />


(function () {
    "use strict";

    WinJS.Namespace.define("FairmandantList", {
        _fairmandantView: {
            get: function () {
                var ret = AppData.getFormatView("FairMandant", 0, false);
                ret.maxPageSize = 20;
                return ret;
            }
        },
        fairmandantView: {
            select: function (complete, error, restriction, recordId) {
                Log.call(Log.l.trace, "FairmandantList.");
                var ret;
                if (recordId) {
                    ret = FairmandantList._fairmandantView.selectById(complete, error, recordId);
                } else {
                    ret = FairmandantList._fairmandantView.select(complete, error, restriction, {
                        ordered: true,
                        orderAttribute: "Name"
                    });
                }
                // this will return a promise to controller
                Log.ret(Log.l.trace);
                return ret;
            },
            getNextUrl: function (response) {
                Log.call(Log.l.trace, "FairmandantList.");
                var ret = FairmandantList._fairmandantView.getNextUrl(response);
                Log.ret(Log.l.trace);
                return ret;
            },
            selectNext: function (complete, error, response, nextUrl) {
                Log.call(Log.l.trace, "FairmandantList.");
                var ret = FairmandantList._fairmandantView.selectNext(complete, error, response, nextUrl);
                // this will return a promise to controller
                Log.ret(Log.l.trace);
                return ret;
            }
        }
    });
})();

