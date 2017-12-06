// controller for page: fairmandant
/// <reference path="~/www/lib/WinJS/scripts/base.js" />
/// <reference path="~/www/lib/WinJS/scripts/ui.js" />
/// <reference path="~/www/lib/convey/scripts/appSettings.js" />
/// <reference path="~/www/lib/convey/scripts/dataService.js" />
/// <reference path="~/www/lib/convey/scripts/appbar.js" />
/// <reference path="~/www/lib/convey/scripts/pageController.js" />
/// <reference path="~/www/scripts/generalData.js" />
/// <reference path="~/www/pages/fairmandant/fairmandantService.js" />

(function () {
    "use strict";

    WinJS.Namespace.define("Fairmandant", {
        Controller: WinJS.Class.derive(Application.Controller, function Controller(pageElement, commandList) {
            Log.call(Log.l.trace, "Fairmandant.Controller.");
            Application.Controller.apply(this, [pageElement, {
                dataMandant: getEmptyDefaultValue(Fairmandant.fairmandantView.defaultValue),
                InitLandItem: { InitLandID: 0, TITLE: "" },
                InitFairManTypItem: { InitFairManTypID: 0, TITLE: "" }
            }, commandList]);
            var that = this;

            // select combo
            var initLand = pageElement.querySelector("#InitLand");
            var initFairManTyp = pageElement.querySelector("#InitFairManTyp");

            this.dispose = function () {
                if (initLand && initLand.winControl) {
                    initLand.winControl.data = null;
                }
                if (initFairManTyp && initFairManTyp.winControl) {
                    initFairManTyp.winControl.data = null;
                }
            }

            var setDataMandant = function (newDataMandant) {
                var prevNotifyModified = AppBar.notifyModified;
                AppBar.notifyModified = false;
                that.binding.dataMandant = newDataMandant;
                if (that.binding.dataMandant.FairMandantVIEWID) {
                    that.setRecordId(that.binding.dataMandant.FairMandantVIEWID);
                }
                AppBar.modified = false;
                AppBar.notifyModified = prevNotifyModified;
                AppBar.triggerDisableHandlers();
            }
            this.setDataMandant = setDataMandant;

            var setInitLandItem = function (newInitLandItem) {
                var prevNotifyModified = AppBar.notifyModified;
                AppBar.notifyModified = false;
                that.binding.InitLandItem = newInitLandItem;
                AppBar.modified = false;
                AppBar.notifyModified = prevNotifyModified;
            }
            this.setInitLandItem = setInitLandItem;
            
            var setInitFairManTypItem = function (newInitFairManTypItem) {
                var prevNotifyModified = AppBar.notifyModified;
                AppBar.notifyModified = false;
                that.binding.InitFairManTypItem = newInitFairManTypItem;
                AppBar.modified = false;
                AppBar.notifyModified = prevNotifyModified;
            }
            this.setInitFairManTypItem = setInitFairManTypItem;

            var getRecordId = function () {
                Log.call(Log.l.trace, "Fairmandant.Controller.");
                var recordId = AppData.getRecordId("FairMandant");
                if (!recordId) {
                    that.setDataMandant(getEmptyDefaultValue(Fairmandant.fairmandantView.defaultValue));
                }
                Log.ret(Log.l.trace, recordId);
                return recordId;
            }
            this.getRecordId = getRecordId;

            var setRecordId = function (recordId) {
                Log.call(Log.l.trace, "Fairmandant.Controller.", recordId);
                if (!recordId) {
                    that.setDataMandant(getEmptyDefaultValue(Fairmandant.fairmandantView.defaultValue));
                }
                AppData.setRecordId("FairMandant", recordId);
                Log.ret(Log.l.trace);
            }
            this.setRecordId = setRecordId;

            var deleteData = function (complete, error) {
                Log.call(Log.l.trace, "Fairmandant.Controller.");
                AppData.setErrorMsg(that.binding);
                var ret;
                var recordId = getRecordId();
                if (recordId) {
                    AppBar.busy = true;
                    ret = Fairmandant.fairmandantView.deleteRecord(function (response) {
                        AppBar.busy = false;
                        // called asynchronously if ok
                        setRecordId(null);
                        AppData.getUserData(); //TODO why?
                        if (typeof complete === "function") {
                            complete(response);
                        }
                    }, function (errorResponse) {
                        AppBar.busy = false;
                        AppData.setErrorMsg(that.binding, errorResponse);
                        if (typeof error === "function") {
                            error(errorResponse);
                        }
                    }, recordId);
                } else {
                    var err = { status: 0, statusText: "no record selected" };
                    error(err);
                    ret = WinJS.Promise.as();
                }
                Log.ret(Log.l.trace);
                return ret;
            };
            this.deleteData = deleteData;
            
            // define handlers
            this.eventHandlers = {
                clickBack: function (event) {
                    Log.call(Log.l.trace, "Fairmandant.Controller.");
                    if (!Application.showMaster() && WinJS.Navigation.canGoBack === true) {
                        WinJS.Navigation.back(1).done();
                    }
                    Log.ret(Log.l.trace);
                },
                clickNew: function(event){
                    Log.call(Log.l.trace, "Fairmandant.Controller.");
                    that.saveData(function (response) {
                        AppBar.busy = true;
                        Log.print(Log.l.trace, "fairmandant saved");
                        var newMandant = getEmptyDefaultValue(Fairmandant.fairmandantView.defaultValue);
                        Fairmandant.fairmandantView.insert(function (json) {
                            AppBar.busy = false;
                            // this callback will be called asynchronously
                            // when the response is available
                            Log.print(Log.l.info, "fairmandant insert: success!");
                            // fairmandantView returns object already parsed from json file in response
                            if (json && json.d) {
                                that.setDataMandant(json.d);
                                /* Fairmandant Liste neu laden und Selektion auf neue Zeile setzen */
                                var master = Application.navigator.masterControl;
                                if (master && master.controller && master.controller.binding) {
                                    master.controller.binding.fairmandantId = that.binding.dataMandant.FairMandantVIEWID;
                                    master.controller.loadData().then(function () {
                                        master.controller.selectRecordId(that.binding.dataMandant.FairMandantVIEWID);
                                    });
                                }
                            }
                        }, function (errorResponse) {
                            Log.print(Log.l.error, "error inserting fairmandant");
                            AppBar.busy = false;
                            AppData.setErrorMsg(that.binding, errorResponse);
                        }, newMandant);
                    }, function (errorResponse) {
                        Log.print(Log.l.error, "error saving fairmandant");
                    });
                    Log.ret(Log.l.trace);
                },
                clickDelete: function(event){
                    Log.call(Log.l.trace, "Fairmandant.Controller.");
                    var confirmTitle = getResourceText("fairmandant.questionDelete");
                    confirm(confirmTitle, function (result) {
                        if (result) {
                            Log.print(Log.l.trace,"clickDelete: user choice OK");
                            deleteData(function(response) {
                                // delete OK - goto start
                                Application.navigateById("start", event);
                            }, function(errorResponse) {
                                // delete ERROR
                                var message = null;
                                Log.print(Log.l.error, "error status=" + errorResponse.status + " statusText=" + errorResponse.statusText);
                                if (errorResponse.data && errorResponse.data.error) {
                                    Log.print(Log.l.error, "error code=" + errorResponse.data.error.code);
                                    if (errorResponse.data.error.message) {
                                        Log.print(Log.l.error, "error message=" + errorResponse.data.error.message.value);
                                        message = errorResponse.data.error.message.value;
                                    }
                                }
                                if (!message) {
                                    message = getResourceText("error.delete");
                                }
                                alert(message);
                            });
                        } else {
                            Log.print(Log.l.trace, "clickDelete: user choice CANCEL");
                        }
                    });
                    Log.ret(Log.l.trace);
                },
                blockEnterKey: function (event) {
                    for (var i = 0; i < AppBar.commandList.length; i++) {
                        if (AppBar.commandList[i].id === "clickForward")
                            AppBar.commandList[i].key = null;
                    }

                },
                releaseEnterKey: function (event) {
                    for (var i = 0; i < AppBar.commandList.length; i++) {
                        if (AppBar.commandList[i].id === "clickForward")
                            AppBar.commandList[i].key = WinJS.Utilities.Key.enter;
                    }
                },
                clickForward: function (event) {
                    Log.call(Log.l.trace, "Fairmandant.Controller.");
                    that.saveData(function (response) {
                        Log.print(Log.l.trace, "fairmandant saved");
                        var master = Application.navigator.masterControl;
                        if (master && master.controller && master.controller.binding) {
                            master.controller.binding.fairmandantId = that.binding.dataMandant.FairMandantVIEWID;
                            master.controller.loadData(master.controller.binding.fairmandantId).then(function () {
                                master.controller.selectRecordId(that.binding.dataMandant.FairMandantVIEWID);
                            });
                        }
                    },  function (errorResponse) {
                        Log.print(Log.l.error, "error saving fairmandant");
                    });
                    AppBar.triggerDisableHandlers();
                    Log.ret(Log.l.trace);
                },
                clickChangeUserState: function (event) {
                    Log.call(Log.l.trace, "Fairmandant.Controller.");
                    Application.navigateById("userinfo", event);
                    Log.ret(Log.l.trace);
                },
                clickGotoPublish: function (event) {
                    Log.call(Log.l.trace, "Fairmandant.Controller.");
                    Application.navigateById("publish", event);
                    Log.ret(Log.l.trace);
                }
            };

            this.disableHandlers = {
                clickBack: function() {
                    if (WinJS.Navigation.canGoBack === true) {
                        return false;
                    } else {
                        return true;
                    }
                },
                clickNew: function() {
                    //if (that.binding.dataMandant && that.binding.dataMandant.FairMandantVIEWID) {
                        return false;
                    //} else {
                    //    return true;
                    //}
                },
                clickDelete: function() {
                    if (that.binding.dataMandant && that.binding.dataMandant.FairMandantVIEWID && !AppBar.busy) {
                        return false;
                    } else {
                        return true;
                    }
                },
                clickForward: function () {
                    return AppBar.busy;
                }
            }

            var loadInitSelection = function () {
                Log.call(Log.l.trace, "Fairmandant.Controller.");
                if (typeof that.binding.dataMandant.FairMandantVIEWID !== "undefined") {
                    var map, results, curIndex;
                    if (typeof that.binding.dataMandant.INITFairManTypID !== "undefined") {
                        Log.print(Log.l.trace, "calling select initFairManTypData: Id=" + that.binding.dataMandant.INITFairManTypID + "...");
                        map = AppData.initFairManTypView.getMap();
                        results = AppData.initFairManTypView.getResults();
                        if (map && results) {
                            curIndex = map[that.binding.dataMandant.INITFairManTypID];
                            if (typeof curIndex !== "undefined") {
                                that.setInitFairManTypItem(results[curIndex]);
                            }
                        }
                    }
                    if (typeof that.binding.dataMandant.INITLandID !== "undefined") {
                        Log.print(Log.l.trace, "calling select initLandData: Id=" + that.binding.dataMandant.INITLandID + "...");
                        map = AppData.initLandView.getMap();
                        results = AppData.initLandView.getResults();
                        if (map && results) {
                            curIndex = map[that.binding.dataMandant.INITLandID];
                            if (typeof curIndex !== "undefined") {
                                that.setInitLandItem(results[curIndex]);
                            }
                        }
                    }
                }
                Log.ret(Log.l.trace);
                return WinJS.Promise.as();
            }
            this.loadInitSelection = loadInitSelection;

            var loadData = function () {
                Log.call(Log.l.trace, "Fairmandant.Controller.");
                AppData.setErrorMsg(that.binding);
                var ret = new WinJS.Promise.as().then(function () {
                    if (!AppData.initFairManTypView.getResults().length) {
                        Log.print(Log.l.trace, "calling select initFairManTypData...");
                        //@nedra:25.09.2015: load the list of INITFairManTyp for Combobox
                        return AppData.initFairManTypView.select(function (json) {
                            // this callback will be called asynchronously
                            // when the response is available
                            Log.print(Log.l.trace, "initFairManTypView: success!");
                            if (json && json.d && json.d.results) {
                                // Now, we call WinJS.Binding.List to get the bindable list
                                if (initFairManTyp && initFairManTyp.winControl) {
                                    initFairManTyp.winControl.data = new WinJS.Binding.List(json.d.results);
                                }
                            }
                        }, function (errorResponse) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            AppData.setErrorMsg(that.binding, errorResponse);
                        });
                    } else {
                        if (initFairManTyp && initFairManTyp.winControl &&
                            (!initFairManTyp.winControl.data || !initFairManTyp.winControl.data.length)) {
                            initFairManTyp.winControl.data = new WinJS.Binding.List(AppData.initFairManTypView.getResults());
                        }
                        return WinJS.Promise.as();
                    }
                }).then(function () {
                    if (!AppData.initLandView.getResults().length) {
                        Log.print(Log.l.trace, "calling select initLandData...");
                        //@nedra:25.09.2015: load the list of INITLand for Combobox
                        return AppData.initLandView.select(function (json) {
                            // this callback will be called asynchronously
                            // when the response is available
                            Log.print(Log.l.trace, "initLandView: success!");
                            if (json && json.d && json.d.results) {
                                // Now, we call WinJS.Binding.List to get the bindable list
                                if (initLand && initLand.winControl) {
                                    initLand.winControl.data = new WinJS.Binding.List(json.d.results);
                                }
                            }
                        }, function (errorResponse) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            AppData.setErrorMsg(that.binding, errorResponse);
                        });
                    } else {
                        if (initLand && initLand.winControl &&
                            (!initLand.winControl.data || !initLand.winControl.data.length)) {
                            initLand.winControl.data = new WinJS.Binding.List(AppData.initLandView.getResults());
                        }
                        return WinJS.Promise.as();
                    }
                }).then(function () {
                    var recordId = getRecordId();
                    if (recordId) {
                        //load of format relation record data
                        Log.print(Log.l.trace, "calling select fairmandantView...");
                        return Fairmandant.fairmandantView.select(function (json) {
                            AppData.setErrorMsg(that.binding);
                            Log.print(Log.l.trace, "fairmandantView: success!");
                            if (json && json.d) {
                                // now always edit!
                                that.setDataMandant(json.d);
                                loadInitSelection();
                            }
                        }, function (errorResponse) {
                            AppData.setErrorMsg(that.binding, errorResponse);
                        }, recordId);
                    } else {
                        return WinJS.Promise.as();
                    }
                }).then(function () {
                    AppBar.notifyModified = true;
                    return WinJS.Promise.as();
                });
                Log.ret(Log.l.trace);
                return ret;
            }
            this.loadData = loadData;

            // save data
            var saveData = function (complete, error) {
                Log.call(Log.l.trace, "Fairmandant.Controller.");
                AppData.setErrorMsg(that.binding);
                var ret = null;
                var dataMandant = that.binding && that.binding.dataMandant;
                if (dataMandant && AppBar.modified && !AppBar.busy) {
                    var recordId = getRecordId();
                    if (recordId) {
                        AppBar.busy = true;
                        ret = Fairmandant.fairmandantView.update(function (response) {
                            AppBar.busy = false;
                            // called asynchronously if ok
                            Log.print(Log.l.info, "fairmandantData update: success!");
                            AppBar.modified = false;
                            //TODO need substitute for AppData.getContactData(); ?
                            complete(response);
                        }, function (errorResponse) {
                            AppBar.busy = false;
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            AppData.setErrorMsg(that.binding, errorResponse);
                            error(errorResponse);
                        }, recordId, dataMandant).then(function() {
                            //load of format relation record data
                            Log.print(Log.l.trace, "calling select fairmandantView...");
                            return Fairmandant.fairmandantView.select(function (json) {
                                AppData.setErrorMsg(that.binding);
                                Log.print(Log.l.trace, "fairmandantView: success!");
                                if (json && json.d) {
                                    that.setDataMandant(json.d);
                                    loadInitSelection();
                                    //TODO: reload list entry!
                                }
                            }, function (errorResponse) {
                                AppData.setErrorMsg(that.binding, errorResponse);
                            }, recordId);
                        });
                    } else {
                        AppBar.busy = true;
                        ret = Fairmandant.fairmandantView.insert(function (json) {
                            AppBar.busy = false;
                            // this callback will be called asynchronously
                            // when the response is available
                            Log.print(Log.l.info, "fairmandantData insert: success!");
                            // fairmandantData returns object already parsed from json file in response
                            if (json && json.d) {
                                // now always edit!
                                that.setDataMandant(json.d);
                                setRecordId(that.binding.dataMandant.FairMandantVIEWID);
                                //TODO: reload complete list!
                            }
                            complete(json);
                        }, function (errorResponse) {
                            AppBar.busy = false;
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            AppData.setErrorMsg(that.binding, errorResponse);
                            error(errorResponse);
                        }, dataMandant);
                    }
                } else if (AppBar.busy) {
                    ret = WinJS.Promise.timeout(100).then(function() {
                        return that.saveData(complete, error);
                    });
                } else {
                    ret = new WinJS.Promise.as().then(function () {
                        complete(dataMandant);
                    });
                }
                Log.ret(Log.l.trace);
                return ret;
            }
            this.saveData = saveData;

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
