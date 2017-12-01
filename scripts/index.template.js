// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints,
// and then run "window.location.reload()" in the JavaScript Console.
/// <reference path="~/www/lib/WinJS/scripts/base.min.js" />
/// <reference path="~/www/lib/WinJS/scripts/ui.js" />
/// <reference path="~/www/lib/convey/scripts/logging.js" />
/// <reference path="~/www/lib/convey/scripts/pageFrame.js" />
/// <reference path="~/www/scripts/generalData.js" />

(function () {
    "use strict";

    // default settings
    AppData.persistentStatesDefaults = {
        colorSettings: {
            // navigation-color with 100% saturation and brightness
            accentColor: "#ff3c00"
        },
        showAppBkg: false,
        logEnabled: true,
        logLevel: 4,
        logGroup: false,
        logNoStack: true,
        inputBorder: 1,
        odata: {
            https: false,
            hostName: "deimos.convey.de",
            onlinePort: 8080,
            urlSuffix: null,
            onlinePath: "odata_online", // serviceRoot online requests
            login: "",
            password: "",
            registerPath: "odata_register", // serviceRoot register requests
            registerLogin: "AppRegister",
            registerPassword: "6530bv6OIUed3",
            useOffline: false,
            replActive: false,
            replInterval: 30,
            replPrevPostMs: 0,
            replPrevSelectMs: 0,
            replPrevFlowSpecId: 0,
            dbSiteId: 0,
            timeZoneAdjustment: 0,
            timeZoneRemoteAdjustment: null,
            timeZoneRemoteDiffMs: 0,
            serverFailure: false
        }
    };

    // static array of menu groups for the split view pane
    Application.navigationBarGroups = [
        { id: "start", group: 1, svg: "home", disabled: true },
        { id: "initvalues", group: 2, svg: "list_style_numbered", disabled: true },
        { id: "fairs", group: 3, svg: "calendar_7", disabled: true },
        { id: "companies", group: 4, svg: "office_building", disabled: true },
        { id: "registrations", group: 5, svg: "user_smartphone", disabled: true },
        { id: "info", group: 8, svg: "gearwheel", disabled: true }
    ];

    // static array of pages for the navigation bar
    Application.navigationBarPages = [
        { id: "start", group: -1, disabled: false },
        { id: "faircategory", group: 2, disabled: false },
        { id: "faircycle", group: 2, disabled: false },
        { id: "fairtrade", group: 2, disabled: false },
        { id: "fairmandant", group: 4, disabled: false },
        { id: "info", group: 8, disabled: false },
        { id: "settings", group: 8, disabled: false },
        { id: "account", group: 8, disabled: false }
    ];


    // static array of pages master/detail relations
    Application.navigationMasterDetail = [
        { id: "fairmandant", master: "fairmandantList" }
    ];

    // init page for app startup
    Application.initPage = Application.getPagePath("dbinit");
    // home page of app
    Application.startPage = Application.getPagePath("start");

    // some more default page navigation handling
    Application.navigateByIdOverride = function (id, event) {
        Log.call(Log.l.trace, "Application.", "id=" + id);
        if (id === "userinfo") {
            id = "account";
        } else if (id === "initvalues") {
            id = "faircategory";
        } else if (id === "companies") {
            id = "fairmandant";
        }
        Log.ret(Log.l.trace);
        return id;
    };

    // initiate the page frame class
    var pageframe = new Application.PageFrame("LeadSuccessFairs");
})();

