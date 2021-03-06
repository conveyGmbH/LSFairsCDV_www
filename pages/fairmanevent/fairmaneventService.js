﻿// service for page: fairmanevent
/// <reference path="~/www/lib/convey/scripts/strings.js" />
/// <reference path="~/www/lib/convey/scripts/logging.js" />
/// <reference path="~/www/lib/convey/scripts/dataService.js" />

(function () {
    "use strict";

    WinJS.Namespace.define("Fairmanevent", {
        _formatView: {
            get: function () {
                return AppData.getFormatView("FairMandantVeranst", 0);
            }
        }
    });

    WinJS.Namespace.define("Fairmanevent", {
        formatView: {
            select: function (complete, error, restriction) {
                var ret;
                //var master = Application.navigator.masterControl;
                Log.call(Log.l.trace, "Fairmanevent.formatView.");
                //if (master && master.controller && master.controller.binding) {
                //    var fairmandantId = master.controller.binding.fairmandantId;
                //}
                if (typeof restriction === "number") {
                    Log.print(Log.l.trace, "calling selectById... recordId=" + restriction);
                    ret = Fairmanevent._formatView.selectById(complete, error, restriction);
                } else {
                    // add language restriction in format view!
                    if (!restriction) {
                        restriction = {};
                    }
                    restriction.FairMandantID = AppData.getRecordId("FairMandant");
                    Log.print(Log.l.trace, "calling select... LanguageSpecID=" + restriction.LanguageSpecID);
                    ret = Fairmanevent._formatView.select(complete, error, restriction, {
                        ordered: true,
                        desc: true
                    });
                }
                Log.ret(Log.l.trace);
                return ret;
            },
            deleteRecord: function (complete, error, recordId) {
                Log.call(Log.l.trace, "Fairmanevent.formatView.");
                var ret = Fairmanevent._formatView.deleteRecord(function () {
                    if (typeof complete === "function") {
                        complete();
                    }
                }, error, recordId);
                Log.ret(Log.l.trace);
                return ret;
            },
            update: function (complete, error, recordId, viewResponse) {
                Log.call(Log.l.trace, "Fairmanevent.formatView.");
                var ret = Fairmanevent._formatView.update(function () {
                    if (typeof complete === "function") {
                        complete();
                    }
                }, error, recordId, viewResponse);
                Log.ret(Log.l.trace);
                return ret;
            },
            insert: function (complete, error) {
                Log.call(Log.l.trace, "Fairmanevent.formatView.");
                var newRecord = getEmptyDefaultValue(this.defaultValue);
                newRecord.FairMandantID = AppData.getRecordId("FairMandant");
                var ret = Fairmanevent._formatView.insert(function () {
                    if (typeof complete === "function") {
                        complete();
                    }
                }, error, newRecord);
                Log.ret(Log.l.trace);
                return ret;
            },
            getNextUrl: function (response) {
                Log.call(Log.l.trace, "Fairmanevent.formatView.");
                var ret = Fairmanevent._formatView.getNextUrl(response);
                Log.ret(Log.l.trace);
                return ret;
            },
            selectNext: function (complete, error, response, nextUrl) {
                Log.call(Log.l.trace, "Fairmanevent.formatView.");
                var ret = Fairmanevent._formatView.selectNext(complete, error, response, nextUrl);
                // this will return a promise to controller
                Log.ret(Log.l.trace);
                return ret;
            },
            relationName: Fairmanevent._formatView.relationName,
            getRecordId: Fairmanevent._formatView.getRecordId,
            defaultValue: {
                Name: "",
                INITFairLocationID: 0
            }
        }
    });
})();


