// controller for page: registration
/// <reference path="~/www/lib/WinJS/scripts/base.js" />
/// <reference path="~/www/lib/WinJS/scripts/ui.js" />
/// <reference path="~/www/lib/convey/scripts/appSettings.js" />
/// <reference path="~/www/lib/convey/scripts/dataService.js" />
/// <reference path="~/www/lib/convey/scripts/appbar.js" />
/// <reference path="~/www/lib/convey/scripts/pageController.js" />
/// <reference path="~/www/scripts/generalData.js" />
/// <reference path="~/www/pages/registration/registrationService.js" />
/// <reference path="~/www/pages/registration/exportXlsx.js" />

(function () {
    "use strict";

    WinJS.Namespace.define("Registration", {
        Controller: WinJS.Class.derive(Application.Controller, function Controller(pageElement, commandList) {
            Log.call(Log.l.trace, "Registration.Controller.");
            Application.Controller.apply(this, [pageElement, {
                restriction: {
                    Mitarbeiter_AnschriftVIEWID: "",
                    Firmenname: "",
                    Vorname: "",
                    Nachname: "",
                    Strasse: "",
                    PLZ: "",
                    Stadt: "",
                    INITLandID: "",
                    Telefon: "",
                    Email: "",
                    Messe: "",
                    Freischaltung: "",
                    RegistrierungBestaetigt: "",
                    ZuletztAngemeldet: ""
                },
                showFilter: false,
                count: 0,
                progress: {
                    percent: 0,
                    text: "",
                    show: null
                }
            }, commandList]);
            this.nextUrl = null;
            this.loading = false;
            this.registrations = null;

            this.firstRegistrationsIndex = 0;

            var that = this;

            // ListView control
            var listView = pageElement.querySelector("#registrations.listview");

            this.dispose = function () {
                if (listView && listView.winControl) {
                    listView.winControl.itemDataSource = null;
                }
                if (that.registrations) {
                    that.registrations = null;
                }
            }

            var progress = null;
            var counter = null;
            var layout = null;

            var maxLeadingPages = 0;
            var maxTrailingPages = 0;
            
            var background = function (index) {
                if (index % 2 === 0) {
                    return 1;
                } else {
                    return null;
                }
            }
            this.background = background;

            var resultConverter = function (item, index) {
                var map = AppData.initLandView.getMap();
                var results = AppData.initLandView.getResults();
                if (map && results) {
                    var curIndex = map[item.INITLandID];
                    if (typeof curIndex !== "undefined") {
                        var curInitLand = results[curIndex];
                        if (curInitLand) {
                            item["Land"] = curInitLand.TITLE;
                        }
                    }
                }
                item.index = index;
                item.fullName =
                    (item.Vorname ? (item.Vorname + " ") : "") +
                    (item.Nachname ? item.Nachname : "");
                item.address =
                    (item.Strasse ? (item.Strasse + "\r\n") : "") +
                    ((item.PLZ || item.Stadt) ? ((item.PLZ ? (item.PLZ + " ") : "") + (item.Stadt ? item.Stadt : "") + "\r\n") : "") +
                    (item.Land ? (item.Land + "\r\n") : "") +
                    (item.Telefon ? (item.Telefon + "\r\n") : "") +
                    (item.Email ? item.Email : "");
            }
            this.resultConverter = resultConverter;

            var exportData = function () {
                Log.call(Log.l.trace, "Registration.Controller.");
                var dbViewTitle = null;
                var restriction = {};
                var dbView = Registration.registrationView;
                var fileName = "Registrations";
                //ExportXlsx.restriction = that.getRestriction();
                if (dbView) {
                    var exporter = ExportXlsx.exporter;
                    if (!exporter) {
                        exporter = new ExportXlsx.ExporterClass(that.binding.progress);
                    }
                    exporter.showProgress(0);
                    WinJS.Promise.timeout(50).then(function () {
                        exporter.saveXlsxFromView(dbView, fileName, function (result) {
                            AppBar.busy = false;
                            AppBar.triggerDisableHandlers();
                        }, function (errorResponse) {
                            AppData.setErrorMsg(that.binding, errorResponse);
                            AppBar.busy = false;
                            AppBar.triggerDisableHandlers();
                        }, restriction, dbViewTitle);
                    });
                } else {
                    AppBar.busy = false;
                    AppBar.triggerDisableHandlers();
                }
                Log.ret(Log.l.trace);
            }
            that.exportData = exportData;

            var saveRestriction = function () {
                var ret = WinJS.Promise.as().then(function () {
                    
                });
                return ret;
            }
            that.saveRestriction = saveRestriction;
            
            // define handlers
            this.eventHandlers = {
                clickBack: function (event) {
                    Log.call(Log.l.trace, "Registration.Controller.");
                    if (WinJS.Navigation.canGoBack === true) {
                        WinJS.Navigation.back(1).done( /* Your success and error handlers */);
                    }
                    Log.ret(Log.l.trace);
                },
                clickForward: function (event) {
                    Log.call(Log.l.trace, "Registration.Controller.");
                    Application.navigateById("start", event);
                    Log.ret(Log.l.trace);
                },
                clickFilter: function(event) {
                    Log.call(Log.l.trace, "Registration.Controller");
                    that.binding.showFilter = !that.binding.showFilter;
                    Log.ret(Log.l.trace);
                },
                clickExport: function(event) {
                    Log.call(Log.l.trace, "Registration.Controller.");
                    AppBar.busy = true;
                    AppBar.triggerDisableHandlers();
                    WinJS.Promise.timeout(0).then(function () {
                        that.exportData();
                    });
                    Log.ret(Log.l.trace);
                },
                clickReload: function(event) {
                    Log.call(Log.l.trace, "Registration.Controller");
                    that.loadData();
                    Log.ret(Log.l.trace);
                },
                /*onSelectionChanged: function (eventInfo) {
                    Log.call(Log.l.trace, "Registration.Controller.");
                    if (listView && listView.winControl) {
                        var listControl = listView.winControl;
                        if (listControl.selection) {
                            var selectionCount = listControl.selection.count();
                            if (selectionCount === 1) {
                                // Only one item is selected, show the page
                                listControl.selection.getItems().done(function (items) {
                                    var item = items[0];
                                    if (item.data && item.data.Mitarbeiter_AnschriftVIEWID) {
                                        AppData.generalData.setRecordId("Mitarbeiter_Anschrift", item.data.Mitarbeiter_AnschriftVIEWID);
                                        WinJS.Promise.timeout(0).then(function () {
                                            Application.navigateById(MitarbeiterPage, eventInfo);
                                        });
                                    }
                                });
                            }
                        }
                    }
                    Log.ret(Log.l.trace);
                },*/
                onLoadingStateChanged: function (eventInfo) {
                    Log.call(Log.l.trace, "Registration.Controller.");
                    if (listView && listView.winControl) {
                        Log.print(Log.l.trace, "loadingState=" + listView.winControl.loadingState);
                        // single list selection
                        if (listView.winControl.selectionMode !== WinJS.UI.SelectionMode.single) {
                            listView.winControl.selectionMode = WinJS.UI.SelectionMode.single;
                        }
                        // direct selection on each tap
                        if (listView.winControl.tapBehavior !== WinJS.UI.TapBehavior.directSelect) {
                            listView.winControl.tapBehavior = WinJS.UI.TapBehavior.directSelect;
                        }
                        // Double the size of the buffers on both sides
                        if (!maxLeadingPages) {
                            maxLeadingPages = listView.winControl.maxLeadingPages * 4;
                            listView.winControl.maxLeadingPages = maxLeadingPages;
                        }
                        if (!maxTrailingPages) {
                            maxTrailingPages = listView.winControl.maxTrailingPages * 4;
                            listView.winControl.maxTrailingPages = maxTrailingPages;
                        }
                        if (listView.winControl.loadingState === "itemsLoading") {
                            if (!layout) {
                                layout = Application.RegistrationLayout.RegistrationLayout;
                                listView.winControl.layout = { type: layout };
                            }
                        }
                    }
                    Log.ret(Log.l.trace);
                },
                onHeaderVisibilityChanged: function (eventInfo) {
                    Log.call(Log.l.trace, "Registration.Controller.");
                    if (eventInfo && eventInfo.detail) {
                        var visible = eventInfo.detail.visible;
                        if (visible) {
                            var contentHeader = listView.querySelector(".content-header");
                            if (contentHeader) {
                                var halfCircle = contentHeader.querySelector(".half-circle");
                                if (halfCircle && halfCircle.style) {
                                    if (halfCircle.style.visibility === "hidden") {
                                        halfCircle.style.visibility = "";
                                        WinJS.UI.Animation.enterPage(halfCircle);
                                    }
                                }
                            }
                        }
                    }
                    Log.ret(Log.l.trace);
                },
                onFooterVisibilityChanged: function (eventInfo) {
                    Log.call(Log.l.trace, "Registration.Controller.");
                    if (eventInfo && eventInfo.detail) {
                        progress = listView.querySelector(".list-footer .progress");
                        counter = listView.querySelector(".list-footer .counter");
                        var visible = eventInfo.detail.visible;
                        if (visible && that.registrations && that.nextUrl) {
                            that.loading = true;
                            if (progress && progress.style) {
                                progress.style.display = "inline";
                            }
                            if (counter && counter.style) {
                                counter.style.display = "none";
                            }
                            AppData.setErrorMsg(that.binding);
                            Log.print(Log.l.trace, "calling select Registration.registrationView...");
                            var nextUrl = that.nextUrl;
                            that.nextUrl = null;
                            Registration.registrationView.selectNext(function (json) {
                                // this callback will be called asynchronously
                                // when the response is available
                                Log.print(Log.l.trace, "Registration.registrationView: success!");
                                // returns object already parsed from json file in response
                                if (json && json.d) {
                                    that.nextUrl = Registration.registrationView.getNextUrl(json);
                                    var results = json.d.results;
                                    results.forEach(function (item, index) {
                                        that.resultConverter(item, that.binding.count);
                                        that.binding.count = that.registrations.push(item);
                                    });
                                }
                            }, function (errorResponse) {
                                // called asynchronously if an error occurs
                                // or server returns response with an error status.
                                AppData.setErrorMsg(that.binding, errorResponse);
                                if (progress && progress.style) {
                                    progress.style.display = "none";
                                }
                                if (counter && counter.style) {
                                    counter.style.display = "inline";
                                }
                                that.loading = false;
                            }, null, nextUrl);
                        } else {
                            if (progress && progress.style) {
                                progress.style.display = "none";
                            }
                            if (counter && counter.style) {
                                counter.style.display = "inline";
                            }
                            that.loading = false;
                        }
                    }
                    Log.ret(Log.l.trace);
                }

            };

            this.disableHandlers = null;

            // register ListView event handler
            if (listView) {
                //this.addRemovableEventListener(listView, "selectionchanged", this.eventHandlers.onSelectionChanged.bind(this));
                this.addRemovableEventListener(listView, "loadingstatechanged", this.eventHandlers.onLoadingStateChanged.bind(this));
                this.addRemovableEventListener(listView, "footervisibilitychanged", this.eventHandlers.onFooterVisibilityChanged.bind(this));
            }
            
            var loadData = function () {
                Log.call(Log.l.trace, "Registration.Controller.");
                that.loading = true;
                progress = listView.querySelector(".list-footer .progress");
                counter = listView.querySelector(".list-footer .counter");
                if (progress && progress.style) {
                    progress.style.display = "inline";
                }
                if (counter && counter.style) {
                    counter.style.display = "none";
                }
                if (that.registrations) {
                    that.registrations.length = 0;
                }
                AppData.setErrorMsg(that.binding);
                var ret = new WinJS.Promise.as().then(function() {
                    if (!AppData.initLandView.getResults().length) {
                        Log.print(Log.l.trace, "calling select initLandData...");
                        //@nedra:25.09.2015: load the list of INITLand for Combobox
                        return AppData.initLandView.select(function(json) {
                                // this callback will be called asynchronously
                                // when the response is available
                                Log.print(Log.l.trace, "initLandView: success!");
                            },
                            function(errorResponse) {
                                // called asynchronously if an error occurs
                                // or server returns response with an error status.
                                AppData.setErrorMsg(that.binding, errorResponse);
                            });
                    } else {
                        return WinJS.Promise.as();
                    }
                }).then(function() {
                    Log.print(Log.l.trace, "calling select registrationView...");
                    return Registration.registrationView.select(function(json) {
                            // this callback will be called asynchronously
                            // when the response is available
                            Log.print(Log.l.trace, "Registration: success!");
                            // returns object already parsed from json file in response
                            if (json && json.d) {
                                that.binding.count = json.d.results.length;
                                that.nextUrl = Registration.registrationView.getNextUrl(json);
                                var results = json.d.results;
                                if (!that.registrations) {
                                    results.forEach(function(item, index) {
                                        that.resultConverter(item, index);
                                    });
                                    // Now, we call WinJS.Binding.List to get the bindable list
                                    that.registrations = new WinJS.Binding.List(results);
                                    that.binding.count = that.registrations.length;
                                } else {
                                    results.forEach(function(item, index) {
                                        that.resultConverter(item, index);
                                        that.binding.count = that.registrations.push(item);
                                    });
                                }
                                if (listView.winControl) {
                                    // add ListView dataSource
                                    listView.winControl.itemDataSource = that.registrations.dataSource;
                                }
                            } else {
                                that.binding.count = 0;
                                that.nextUrl = null;
                                that.registrations = null;
                                if (listView.winControl) {
                                    // add ListView dataSource
                                    listView.winControl.itemDataSource = null;
                                }
                                progress = listView.querySelector(".list-footer .progress");
                                counter = listView.querySelector(".list-footer .counter");
                                if (progress && progress.style) {
                                    progress.style.display = "none";
                                }
                                if (counter && counter.style) {
                                    counter.style.display = "inline";
                                }
                                that.loading = false;
                            }
                        },
                        function(errorResponse) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            AppData.setErrorMsg(that.binding, errorResponse);
                            progress = listView.querySelector(".list-footer .progress");
                            counter = listView.querySelector(".list-footer .counter");
                            if (progress && progress.style) {
                                progress.style.display = "none";
                            }
                            if (counter && counter.style) {
                                counter.style.display = "inline";
                            }
                            that.loading = false;
                        },
                        that.binding.restriction
                    );
                });
                Log.ret(Log.l.trace);
                return ret;
            };
            this.loadData = loadData;

            that.processAll().then(function () {
                Log.print(Log.l.trace, "Binding wireup page complete");
                return that.loadData();
            }).then(function () {
                AppBar.notifyModified = true;
                Log.print(Log.l.trace, "Data loaded");
            });
            Log.ret(Log.l.trace);
        })
    });
})();






