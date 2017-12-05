// controller for page: fairmandantList
/// <reference path="~/www/lib/WinJS/scripts/base.js" />
/// <reference path="~/www/lib/WinJS/scripts/ui.js" />
/// <reference path="~/www/lib/convey/scripts/appSettings.js" />
/// <reference path="~/www/lib/convey/scripts/dataService.js" />
/// <reference path="~/www/lib/convey/scripts/appbar.js" />
/// <reference path="~/www/lib/convey/scripts/pageController.js" />
/// <reference path="~/www/scripts/generalData.js" />
/// <reference path="~/www/pages/fairmandantList/fairmandantListService.js" />
/// <reference path="~/www/pages/fairmandant/fairmandantController.js" />

(function () {
    "use strict";

    var nav = WinJS.Navigation;

    WinJS.Namespace.define("FairmandantList", {
        Controller: WinJS.Class.derive(Application.Controller, function Controller(pageElement, commandList, isMaster) {
                Log.call(Log.l.trace, "FairmandantList.Controller.");
                Application.Controller.apply(this,[pageElement, {
                        count: 0,
                        fairmandantId: null
                }, commandList, isMaster]);
                this.nextUrl = null;
                this.loading = false;
                this.fairmandants = null;

                var that = this;

                // ListView control
                var listView = pageElement.querySelector("#fairmandantList.listview");

                this.dispose = function () {
                    if (listView && listView.winControl) {
                        listView.winControl.itemDataSource = null;
                    }
                    if (that.fairmandants) {
                        that.fairmandants = null;
                    }
                    listView = null;
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
                };
                this.background = background;
            
                var loadNextUrl = function (recordId) {
                    Log.call(Log.l.trace, "FairmandantList.Controller.", "recordId=" + recordId);
                    if (that.fairmandants && that.nextUrl && listView) {
                        progress = listView.querySelector(".list-footer .progress");
                        counter = listView.querySelector(".list-footer .counter");
                        that.loading = true;
                        if (progress && progress.style) {
                            progress.style.display = "inline";
                        }
                        if (counter && counter.style) {
                            counter.style.display = "none";
                        }
                        AppData.setErrorMsg(that.binding);
                        Log.print(Log.l.trace, "calling select FairmandantList.fairmandantView...");
                        var nextUrl = that.nextUrl;
                        that.nextUrl = null;
                        FairmandantList.fairmandantView.selectNext(function (json) { //json is undefined
                            // this callback will be called asynchronously
                            // when the response is available
                            Log.print(Log.l.trace, "FairmandantList.fairmandantView: success!");
                            // startFairmandant returns object already parsed from json file in response
                            if (json && json.d && that.fairmandants) {
                                that.nextUrl = FairmandantList.fairmandantView.getNextUrl(json);
                                var results = json.d.results;
                                results.forEach(function (item, index) {
                                    that.resultConverter(item, that.binding.count);
                                    that.binding.count = that.fairmandants.push(item);
                                });
                            }
                            if (recordId) {
                                that.selectRecordId(recordId);
                            }
                        }, function (errorResponse) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            Log.print(Log.l.error, "FairmandantList.fairmandantView: error!");
                            AppData.setErrorMsg(that.binding, errorResponse);
                            if (progress && progress.style) {
                                progress.style.display = "none";
                            }
                            if (counter && counter.style) {
                                counter.style.display = "inline";
                            }
                            that.loading = false;
                        }, null, nextUrl);
                    }
                    Log.ret(Log.l.trace);
                }
                this.loadNextUrl = loadNextUrl;

                var scopeFromRecordId = function (recordId) {
                    var i;
                    Log.call(Log.l.trace, "FairmandantList.Controller.", "recordId=" + recordId);
                    var item = null;
                    if (that.fairmandants) {
                        for (i = 0; i < that.fairmandants.length; i++) {
                            var fairmandant = that.fairmandants.getAt(i);
                            if (fairmandant && typeof fairmandant === "object" &&
                                fairmandant.FairMandantVIEWID === recordId) {
                                item = fairmandant;
                                break;
                            }
                        }
                    }
                    if (item) {
                        Log.ret(Log.l.trace, "i=" + i);
                        return { index: i, item: item };
                    } else {
                        Log.ret(Log.l.trace, "not found");
                        return null;
                    }
                };
                this.scopeFromRecordId = scopeFromRecordId;

                var scrollToRecordId = function (recordId) {
                    Log.call(Log.l.trace, "FairmandantList.Controller.", "recordId=" + recordId);
                    if (that.loading) {
                        WinJS.Promise.timeout(50).then(function () {
                            that.scrollToRecordId(recordId);
                        });
                    } else {
                        if (recordId && listView && listView.winControl && that.fairmandants) {
                            for (var i = 0; i < that.fairmandants.length; i++) {
                                var fairmandant = that.fairmandants.getAt(i);
                                if (fairmandant && typeof fairmandant === "object" &&
                                    fairmandant.FairMandantVIEWID === recordId) {
                                    listView.winControl.indexOfFirstVisible = i - 1;
                                    break;
                                }
                            }
                        }
                    }
                    Log.ret(Log.l.trace);
                }
                this.scrollToRecordId = scrollToRecordId;

                var selectRecordId = function (recordId) {
                    var fairmandant;
                    Log.call(Log.l.trace, "FairmandantList.Controller.", "recordId=" + recordId);
                    var recordIdNotFound = true;
                    if (recordId && listView && listView.winControl && listView.winControl.selection && that.fairmandants) {
                        for (var i = 0; i < that.fairmandants.length; i++) {
                            fairmandant = that.fairmandants.getAt(i);
                            if (fairmandant &&
                                typeof fairmandant === "object" &&
                                fairmandant.FairMandantVIEWID === recordId) {
                                AppData.setRecordId("FairMandant", recordId);
                                listView.winControl.selection.set(i).done(function() {
                                    WinJS.Promise.timeout(50).then(function() {
                                        that.scrollToRecordId(recordId);
                                    });
                                });
                                recordIdNotFound = false;
                                break;
                            }
                        }
                        if (recordIdNotFound) {
                            that.loadNextUrl(recordId);
                        }
                    }
                    Log.ret(Log.l.trace);
                }
                this.selectRecordId = selectRecordId;

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

                    map = AppData.initFairManTypView.getMap();
                    results = AppData.initFairManTypView.getResults();
                    if (map && results) {
                        var curInd = map[item.INITFairManTypID];
                        if (typeof curInd !== "undefined") {
                            var curInitFairManTyp = results[curInd];
                            if (curInitFairManTyp) {
                                item["manTyp"] = curInitFairManTyp.TITLE;
                            }
                        }
                    }

                    item.index = index;
                    item.svgFormOf = "office_building";
                    item.address =
                        ((item.Strasse ? (item.Strasse + "\r\n") : "") +
                            ((item.PLZ || item.Stadt)
                                ? ((item.PLZ ? (item.PLZ + " ") : "") + (item.Stadt ? item.Stadt : "") + "\r\n")
                                : "") +
                            (item.Land ? (item.Land + "\r\n") : "") +
                            ((item.TelefonMobil)
                                ? (item.TelefonMobil + "\r\n")
                                : (item.TelefonFestnetz ? (item.TelefonFestnetz + "\r\n") : "") +
                                (item.EMail ? item.EMail : "")));
                }
                this.resultConverter = resultConverter;
            
                // define handlers
                this.eventHandlers = {
                    clickBack: function (event) {
                        Log.call(Log.l.trace, "FairmandantList.Controller.");
                        if (WinJS.Navigation.canGoBack === true) {
                            WinJS.Navigation.back(1).done();
                        }
                        Log.ret(Log.l.trace);
                    },
                    onSelectionChanged: function (eventInfo) {
                        Log.call(Log.l.trace, "FairmandantList.Controller.");
                        if (listView && listView.winControl) {
                            var listControl = listView.winControl;
                            if (listControl.selection) {
                                var selectionCount = listControl.selection.count();
                                if (selectionCount === 1) {
                                    // Only one item is selected, show the page
                                    listControl.selection.getItems().done(function (items) {
                                        var item = items[0];
                                        var curPageId = Application.getPageId(nav.location);
                                        if (item.data &&
                                            item.data.FairMandantVIEWID &&
                                            item.data.FairMandantVIEWID !== that.binding.fairmandantId) {
                                            if (AppBar.scope && typeof AppBar.scope.saveData === "function") {
                                                //=== "function" save wird nicht aufgerufen wenn selectionchange
                                                // current detail view has saveData() function
                                                AppBar.scope.saveData(function (response) {
                                                    // called asynchronously if ok
                                                    that.binding.fairmandantId = item.data.FairMandantVIEWID;
                                                    AppData.setRecordId("FairMandant", that.binding.fairmandantId);
                                                    if (curPageId === "fairmandant" &&
                                                        typeof AppBar.scope.loadData === "function") {
                                                        AppBar.scope.loadData();
                                                    } else {
                                                        Application.navigateById("fairmandant");
                                                    }
                                                },  function (errorResponse) {
                                                    that.selectRecordId(that.binding.fairmandantId);
                                                });
                                            } else {
                                                // current detail view has NO saveData() function - is list
                                                that.binding.fairmandantId = item.data.FairMandantVIEWID;
                                                AppData.setRecordId("FairMandant", that.binding.fairmandantId);
                                                if (curPageId === "fairmandant" &&
                                                    typeof AppBar.scope.loadData === "function") {
                                                    AppBar.scope.loadData();
                                                } else {
                                                    Application.navigateById("fairmandant");
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }
                        Log.ret(Log.l.trace);
                    },
                    onItemInvoked: function(eventInfo) {
                        Log.call(Log.l.trace, "FairmandantList.Controller.");
                        Application.showDetail();
                        Log.ret(Log.l.trace);
                    },
                    onLoadingStateChanged: function (eventInfo) {
                        Log.call(Log.l.trace, "FairmandantList.Controller.");
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
                                    layout = Application.FairmandantListLayout.FairmandantsLayout;
                                    listView.winControl.layout = { type: layout };
                                }
                            } else if (listView.winControl.loadingState === "complete") {
                                // load SVG images
                                Colors.loadSVGImageElements(listView, "action-image", 40, Colors.textColor, "name");
                                if (that.loading) {
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
                            }
                        }
                        Log.ret(Log.l.trace);
                    },
                    onHeaderVisibilityChanged: function (eventInfo) {
                        Log.call(Log.l.trace, "FairmandantList.Controller.");
                        if (eventInfo && eventInfo.detail && listView) {
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
                        Log.call(Log.l.trace, "FairmandantList.Controller.");
                        if (listView) {
                            progress = listView.querySelector(".list-footer .progress");
                            counter = listView.querySelector(".list-footer .counter");
                            var visible = eventInfo.detail.visible;

                            if (visible && that.fairmandants && that.nextUrl) {
                                that.loadNextUrl();
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

                this.disableHandlers = {
                    clickBack: function () {
                        if (WinJS.Navigation.canGoBack === true) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }

                // register ListView event handler
                if (listView) {
                    this.addRemovableEventListener(listView, "iteminvoked", this.eventHandlers.onItemInvoked.bind(this));
                    this.addRemovableEventListener(listView, "selectionchanged", this.eventHandlers.onSelectionChanged.bind(this));
                    this.addRemovableEventListener(listView, "loadingstatechanged", this.eventHandlers.onLoadingStateChanged.bind(this));
                    this.addRemovableEventListener(listView, "footervisibilitychanged", this.eventHandlers.onFooterVisibilityChanged.bind(this));
                }

                Log.print(Log.l.trace, "calling select FairmandantList.fairmandantView...");
                var loadData = function (recordId) {
                    Log.call(Log.l.trace, "FairmandantList.Controller.");
                    that.loading = true;
                    if (listView) {
                        progress = listView.querySelector(".list-footer .progress");
                        counter = listView.querySelector(".list-footer .counter");
                        if (progress && progress.style) {
                            progress.style.display = "inline";
                        }
                        if (counter && counter.style) {
                            counter.style.display = "none";
                        }
                    }
                    AppData.setErrorMsg(that.binding);
                    var ret = new WinJS.Promise.as().then(function () {
                        if (!AppData.initLandView.getResults().length) {
                            Log.print(Log.l.trace, "calling select initLandData...");
                            //@nedra:25.09.2015: load the list of INITLand for Combobox
                            return AppData.initLandView.select(function (json) {
                                // this callback will be called asynchronously
                                // when the response is available
                                Log.print(Log.l.trace, "initLandView: success!");
                            },
                                function (errorResponse) {
                                    // called asynchronously if an error occurs
                                    // or server returns response with an error status.
                                    AppData.setErrorMsg(that.binding, errorResponse);
                                });
                        } else {
                            return WinJS.Promise.as();
                        }
                    }).then(function () {
                        return FairmandantList.fairmandantView.select(function (json) {
                            // this callback will be called asynchronously
                            // when the response is available
                            Log.print(Log.l.trace, "fairmandantView: success!");
                            // startFairmandant returns object already parsed from json file in response
                            if (!recordId) {
                                if (json && json.d) {
                                    that.binding.count = json.d.results.length;
                                    that.nextUrl = FairmandantList.fairmandantView.getNextUrl(json);
                                    var results = json.d.results;
                                    results.forEach(function (item, index) {
                                        that.resultConverter(item, index);
                                    });
                                    that.fairmandants = new WinJS.Binding.List(results);

                                    if (listView && listView.winControl) {
                                        // add ListView dataSource
                                        listView.winControl.itemDataSource = that.fairmandants.dataSource;
                                    }
                                    Log.print(Log.l.trace, "Data loaded");
                                    if (results[0] && results[0].FairMandantVIEWID) {
                                        WinJS.Promise.timeout(0).then(function() {
                                            that.selectRecordId(results[0].FairMandantVIEWID);
                                        });
                                    }
                                } else {
                                    that.binding.count = 0;
                                    that.nextUrl = null;
                                    that.fairmandants = null;
                                    if (listView) {
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
                                    }
                                    that.loading = false;
                                }
                            } else {
                                if (json && json.d && that.fairmandants) {
                                    var objectrec = scopeFromRecordId(recordId);
                                    var fairmandant = json.d;
                                    that.resultConverter(fairmandant, objectrec.index);
                                    that.fairmandants.setAt(objectrec.index, fairmandant);
                                }
                            }
                        },  function (errorResponse) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            AppData.setErrorMsg(that.binding, errorResponse);
                            if (listView) {
                                progress = listView.querySelector(".list-footer .progress");
                                counter = listView.querySelector(".list-footer .counter");
                                if (progress && progress.style) {
                                    progress.style.display = "none";
                                }
                                if (counter && counter.style) {
                                    counter.style.display = "inline";
                                }
                            }
                            that.loading = false;
                        },
                            {}, //TODO restriction necessary?
                        recordId);
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
                    Log.print(Log.l.trace, "Record selected");
                });
                Log.ret(Log.l.trace);
            })
    });
})();






