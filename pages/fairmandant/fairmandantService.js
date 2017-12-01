// services for page: fairmandant
/// <reference path="~/www/lib/convey/scripts/strings.js" />
/// <reference path="~/www/lib/convey/scripts/logging.js" />
/// <reference path="~/www/lib/convey/scripts/dataService.js" />

(function () {
    "use strict";

    WinJS.Namespace.define("Fairmandant", {
        _fairmandantView: {
            get: function () {
                return AppData.getFormatView("FairMandant", 0);
            }
        },
        fairmandantView: {
            select: function (complete, error, recordId) {
                Log.call(Log.l.trace, "fairmandantView.");
                var ret = Fairmandant._fairmandantView.selectById(complete, error, recordId);
                Log.ret(Log.l.trace);
                return ret;

            },
            deleteRecord: function (complete, error, recordId) {
                Log.call(Log.l.trace, "contactView.");
                var ret = Fairmandant._fairmandantView.deleteRecord(complete, error, recordId);
                Log.ret(Log.l.trace);
                return ret;
            },
            update: function (complete, error, recordId, viewResponse) {
                Log.call(Log.l.trace, "contactView.");
                var ret = Fairmandant._fairmandantView.update(complete, error, recordId, viewResponse);
                Log.ret(Log.l.trace);
                return ret;
            },
            insert: function (complete, error, viewResponse) {
                Log.call(Log.l.trace, "contactView.");
                var ret = Fairmandant._fairmandantView.insert(complete, error, viewResponse);
                Log.ret(Log.l.trace);
                return ret;
            },
            defaultValue: {
                Name: "",
                Ansprechpartner: "",
                Strasse: "",
                Postfach: "",
                PLZ: "",
                Stadt: "",
                BundeslandProvinz: "",
                INITLandID: 0,
                TelefonFestnetz: "",
                TelefonMobil: "",
                Fax: "",
                EMail: "",
                WebAdresse: "",
                INITFairManTypID: 0
            }
        }
    });
})();
