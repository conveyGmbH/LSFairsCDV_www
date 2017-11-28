// controller for page: mandate
/// <reference path="~/www/lib/WinJS/scripts/base.js" />
/// <reference path="~/www/lib/WinJS/scripts/ui.js" />
/// <reference path="~/www/lib/convey/scripts/appSettings.js" />
/// <reference path="~/www/lib/convey/scripts/dataService.js" />
/// <reference path="~/www/lib/convey/scripts/appbar.js" />
/// <reference path="~/www/lib/convey/scripts/pageController.js" />
/// <reference path="~/www/scripts/generalData.js" />
/// <reference path="~/www/pages/mandate/mandateService.js" />

(function () {
    "use strict";

    WinJS.Namespace.define("Mandate", {
        Controller: WinJS.Class.derive(Application.Controller, function Controller(pageElement, commandList) {
            Log.call(Log.l.trace, "Mandate.Controller.");
            Application.Controller.apply(this, [pageElement, {
                /* unadapted lines
                dataContact: getEmptyDefaultValue(Contact.contactView.defaultValue),
                InitAnredeItem: { InitAnredeID: 0, TITLE: "" },
                InitLandItem: { InitLandID: 0, TITLE: "" },
                showPhoto: false,
                */
                showModified: false
            }, commandList]);
            var that = this;

            // select combo
            var initAnrede = pageElement.querySelector("#InitAnrede");
            var initLand = pageElement.querySelector("#InitLand");
            var textComment = pageElement.querySelector(".input_text_comment");

            this.dispose = function () {
                if (initAnrede && initAnrede.winControl) {
                    initAnrede.winControl.data = null;
                }
                if (initLand && initLand.winControl) {
                    initLand.winControl.data = null;
                }
            }

            var setDataContact = function (newDataContact) {
                var prevNotifyModified = AppBar.notifyModified;
                AppBar.notifyModified = false;
                // Bug: textarea control shows 'null' string on null value in Internet Explorer!
                if (newDataContact.Bemerkungen === null) {
                    newDataContact.Bemerkungen = "";
                }
                that.binding.dataContact = newDataContact;
                if (!that.binding.dataContact.KontaktVIEWID) {
                    that.binding.dataContact.Nachbearbeitet = 1;
                }
                if (that.binding.dataContact.Erfassungsdatum === that.binding.dataContact.ModifiedTS) {
                    that.binding.showModified = false;
                } else {
                    that.binding.showModified = true;
                }
                if (textComment) {
                    if (that.binding.dataContact.Bemerkungen) {
                        WinJS.Utilities.addClass(textComment, "input_text_comment_big");
                    } else {
                        WinJS.Utilities.removeClass(textComment, "input_text_comment_big");
                    }
                }
                that.binding.dataContact.Mitarbeiter_Fullname = that.binding.dataContact.Mitarbeiter_Vorname + " " + that.binding.dataContact.Mitarbeiter_Nachname;

                if (that.binding.dataContact.Bearbeiter_Vorname && that.binding.dataContact.Bearbeiter_Nachname) {
                    that.binding.dataContact
                        .Bearbeiter_Fullname = that.binding.dataContact.Bearbeiter_Vorname +
                        " " +
                        that.binding.dataContact.Bearbeiter_Nachname;
                } else {
                    that.binding.dataContact.Bearbeiter_Fullname = "";
                }
                AppBar.modified = false;
                AppBar.notifyModified = prevNotifyModified;
                AppBar.triggerDisableHandlers();
            }
            this.setDataContact = setDataContact;

            var setInitLandItem = function (newInitLandItem) {
                var prevNotifyModified = AppBar.notifyModified;
                AppBar.notifyModified = false;
                that.binding.InitLandItem = newInitLandItem;
                AppBar.modified = false;
                AppBar.notifyModified = prevNotifyModified;
            }
            this.setInitLandItem = setInitLandItem;

            var setInitAnredeItem = function (newInitAnredeItem) {
                var prevNotifyModified = AppBar.notifyModified;
                AppBar.notifyModified = false;
                that.binding.InitAnredeItem = newInitAnredeItem;
                AppBar.modified = false;
                AppBar.notifyModified = prevNotifyModified;
            }
            this.setInitAnredeItem = setInitAnredeItem;

            var getRecordId = function () {
                Log.call(Log.l.trace, "Mandate.Controller.");
                var recordId = AppData.getRecordId(/*"Mandattabelle"*/);
                if (!recordId) {
                    that.setDataContact(getEmptyDefaultValue(/*Contact.contactView.defaultValue*/));
                }
                Log.ret(Log.l.trace, recordId);
                return recordId;
            }
            this.getRecordId = getRecordId;

            var setRecordId = function (recordId) {
                Log.call(Log.l.trace, "Mandate.Controller.", recordId);
                if (!recordId) {
                    that.setDataContact(getEmptyDefaultValue(/*Contact.contactView.defaultValue*/));
                }
                AppData.setRecordId(/*"Mandattabelle",*/ recordId);
                Log.ret(Log.l.trace);
            }
            this.setRecordId = setRecordId;

            /*var deleteData = function (complete, error) {
                Log.call(Log.l.trace, "Mandate.Controller.");
                AppData.setErrorMsg(that.binding);
                var ret;
                var recordId = getRecordId();
                if (recordId) {
                    AppBar.busy = true;
                    ret = Contact.contactView.deleteRecord(function (response) {
                        AppBar.busy = false;
                        // called asynchronously if ok
                        setRecordId(null);
                        AppData.getUserData();
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
            this.deleteData = deleteData;*/
            
            var resultMandatoryConverter = function (item, index) {
                var inputfield = pageElement.querySelector("#" + item.AttributeName);
                if (inputfield === null) {
                    if (item.AttributeName === "AnredeID")
                        inputfield = pageElement.querySelector("#InitAnrede");
                    if (item.AttributeName === "LandID")
                        inputfield = pageElement.querySelector("#InitLand");
                }
                if (item.FieldFlag) {
                    if (inputfield !== null && inputfield !== undefined)
                        if (Colors.isDarkTheme) {
                            WinJS.Utilities.addClass(inputfield, "darkthemeMandatory");
                            //WinJS.Utilities.removeClass(inputfield, "lightthemeMandatory");
                        } else {
                            WinJS.Utilities.addClass(inputfield, "lightthemeMandatory");
                            //WinJS.Utilities.removeClass(inputfield, "darkthemeMandatory");
                        }
                }
            };
            this.resultMandatoryConverter = resultMandatoryConverter;

            // define handlers
            this.eventHandlers = {
                clickBack: function (event) {
                    Log.call(Log.l.trace, "Mandate.Controller.");
                    if (!Application.showMaster() && WinJS.Navigation.canGoBack === true) {
                        WinJS.Navigation.back(1).done();
                    }
                    Log.ret(Log.l.trace);
                },
                clickNew: function(event){
                    Log.call(Log.l.trace, "Mandate.Controller.");
                    Application.navigateById(Application.navigateNewId, event);
                    Log.ret(Log.l.trace);
                },
                clickDelete: function(event){
                    Log.call(Log.l.trace, "Mandate.Controller.");
                    var confirmTitle = getResourceText("mandate.questionDelete");
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
                    Log.call(Log.l.trace, "Mandate.Controller.");
                    that.saveData(function (response) {
                        Log.print(Log.l.trace, "mandate saved");
                        var master = Application.navigator.masterControl;
                        if (master && master.controller && master.controller.binding) {
                            /* unadapted lines
                            master.controller.binding.contactId = that.binding.dataContact.KontaktVIEWID;
                            master.controller.loadData(master.controller.binding.contactId).then(function () {
                                master.controller.selectRecordId(that.binding.dataContact.KontaktVIEWID);
                            });
                            */
                        }
                    },
                        function (errorResponse) {
                            Log.print(Log.l.error, "error saving employee");
                        });

                    AppBar.triggerDisableHandlers();
                    Log.ret(Log.l.trace);
                },
                clickChangeUserState: function (event) {
                    Log.call(Log.l.trace, "Mandate.Controller.");
                    Application.navigateById("userinfo", event);
                    Log.ret(Log.l.trace);
                },
                clickGotoPublish: function (event) {
                    Log.call(Log.l.trace, "Mandate.Controller.");
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
                    if (that.binding.dataContact /*&& that.binding.dataContact.KontaktVIEWID*/) {
                        return false;
                    } else {
                        return true;
                    }
                },
                clickDelete: function() {
                    if (that.binding.dataContact /*&& that.binding.dataContact.KontaktVIEWID*/ && !AppBar.busy) {
                        return false;
                    } else {
                        return true;
                    }
                },
                clickForward: function () {
                    return AppBar.busy;
                }
            }

            var loadData = function () {
                Log.call(Log.l.trace, "Mandate.Controller.");
                AppData.setErrorMsg(that.binding);
                var ret = new WinJS.Promise.as()./*then(function () {
                     unadapted lines INITAnrede
                    if (!AppData.initAnredeView.getResults().length) {
                        Log.print(Log.l.trace, "calling select initAnredeData...");
                        //@nedra:25.09.2015: load the list of INITAnrede for Combobox
                        return AppData.initAnredeView.select(function (json) {
                            Log.print(Log.l.trace, "initAnredeView: success!");
                            if (json && json.d && json.d.results) {
                                // Now, we call WinJS.Binding.List to get the bindable list
                                if (initAnrede && initAnrede.winControl) {
                                    initAnrede.winControl.data = new WinJS.Binding.List(json.d.results);
                                }
                            }
                        }, function (errorResponse) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            AppData.setErrorMsg(that.binding, errorResponse);
                        });
                    } else {
                        if (initAnrede && initAnrede.winControl &&
                            (!initAnrede.winControl.data || !initAnrede.winControl.data.length)) {
                            initAnrede.winControl.data = new WinJS.Binding.List(AppData.initAnredeView.getResults());
                        }
                        return WinJS.Promise.as();
                    }
                    
                }).then(function () {
                     unadapted lines INITLand
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
                    return Contact.mandatoryView.select(function (json) {
                        // this callback will be called asynchronously
                        // when the response is available
                        Log.print(Log.l.trace, "MandatoryList.mandatoryView: success!");
                        // select returns object already parsed from json file in response
                        if (json && json.d) {
                            //that.nextUrl = MandatoryList.mandatoryView.getNextUrl(json);
                            var results = json.d.results;
                            results.forEach(function (item, index) {
                                that.resultMandatoryConverter(item, index);
                            });
                        }
                    }, function (errorResponse) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        AppData.setErrorMsg(that.binding, errorResponse);
                    }, {
                        LanguageSpecID: AppData.getLanguageId()
                    });

                }).then(function () {
                    var recordId = getRecordId();
                    if (recordId) {
                        //load of format relation record data
                        Log.print(Log.l.trace, "calling select mandateView...");
                        return Contact.contactView.select(function (json) {
                            AppData.setErrorMsg(that.binding);
                            Log.print(Log.l.trace, "mandateView: success!");
                            if (json && json.d) {
                                // now always edit!
                                json.d.Flag_NoEdit = AppRepl.replicator && AppRepl.replicator.inFastRepl;
                                that.setDataContact(json.d);
                                var importCardscanId = AppData.getRecordId("DOC1IMPORT_CARDSCAN");
                                if (importCardscanId !== json.d.DOC1Import_CardscanID) {
                                    AppData._photoData = null;
                                    AppData.setRecordId("DOC1IMPORT_CARDSCAN", json.d.DOC1Import_CardscanID);
                                }
                                loadInitSelection();
                            }
                        }, function (errorResponse) {
                            AppData._photoData = null;
                            AppData.setRecordId("DOC1IMPORT_CARDSCAN", null);
                            AppData.setErrorMsg(that.binding, errorResponse);
                        }, recordId);
                    } else {
                        AppData._photoData = null;
                        AppData.setRecordId("DOC1IMPORT_CARDSCAN", null);
                        return WinJS.Promise.as();
                    }
                }).then(function () {
                    if (getPhotoData()) {
                        showPhoto();
                        return WinJS.Promise.as();
                    } else {
                        var importCardscanId = AppData.getRecordId("DOC1IMPORT_CARDSCAN");
                        if (importCardscanId) {
                            Log.print(Log.l.trace, "calling select contactView...");
                            return Contact.cardScanView.select(function (json) {
                                AppData.setErrorMsg(that.binding);
                                Log.print(Log.l.trace, "cardScanData: success!");
                                if (json && json.d) {
                                    var docContent;
                                    //if (json.d.wFormat === 1) {
                                    //    docContent = json.d.PrevContentDOCCNT2;
                                    //} else {
                                    docContent = json.d.DocContentDOCCNT1;
                                    //}
                                    if (docContent) {
                                        var sub = docContent.search("\r\n\r\n");
                                        AppData._photoData = docContent.substr(sub + 4);
                                    } else {
                                        AppData._photoData = null;
                                    }
                                } else {
                                    AppData._photoData = null;
                                }
                                showPhoto();
                            }, function (errorResponse) {
                                AppData._photoData = null;
                                showPhoto();
                                AppData.setErrorMsg(that.binding, errorResponse);
                            }, importCardscanId);
                        } else {
                            AppData._photoData = null;
                            showPhoto();
                            return WinJS.Promise.as();
                        }
                    }
                }).*/then(function () {
                    AppBar.notifyModified = true;
                    return WinJS.Promise.as();
                });
                Log.ret(Log.l.trace);
                return ret;
            }
            this.loadData = loadData;

            // save data
            var saveData = function (complete, error) {
                Log.call(Log.l.trace, "Mandate.Controller.");
                AppData.setErrorMsg(that.binding);
                var ret = null;
                var dataContact = that.binding.dataContact;
                // set Nachbearbeitet empty!
                if (!dataContact.Nachbearbeitet) {
                    dataContact.Nachbearbeitet = null;
                } else {
                    dataContact.Nachbearbeitet = 1;
                }
                /*
                if (dataContact && AppBar.modified && !AppBar.busy) {
                    var recordId = getRecordId();
                    if (recordId) {
                        AppBar.busy = true;
                        ret = Contact.contactView.update(function (response) {
                            AppBar.busy = false;
                            // called asynchronously if ok
                            Log.print(Log.l.info, "mandateData update: success!");
                            AppBar.modified = false;
                            AppData.getContactData();
                            complete(response);
                        }, function (errorResponse) {
                            AppBar.busy = false;
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            AppData.setErrorMsg(that.binding, errorResponse);
                            error(errorResponse);
                        }, recordId, dataContact).then(function() {
                            //load of format relation record data
                            Log.print(Log.l.trace, "calling select mandateView...");
                            return Contact.contactView.select(function (json) {
                                AppData.setErrorMsg(that.binding);
                                Log.print(Log.l.trace, "mandateView: success!");
                                if (json && json.d) {
                                    // now always edit!
                                    json.d.Flag_NoEdit = AppRepl.replicator && AppRepl.replicator.inFastRepl;
                                    that.setDataContact(json.d);
                                    loadInitSelection();
                                }
                            }, function (errorResponse) {
                                AppData.setErrorMsg(that.binding, errorResponse);
                            }, recordId);
                        });
                    } else {
                        dataContact.HostName = (window.device && window.device.uuid);
                        dataContact.MitarbeiterID = AppData.getRecordId("Mitarbeiter");
                        dataContact.VeranstaltungID = AppData.getRecordId("Veranstaltung");
                        AppBar.busy = true;
                        ret = Contact.contactView.insert(function (json) {
                            AppBar.busy = false;
                            // this callback will be called asynchronously
                            // when the response is available
                            Log.print(Log.l.info, "contactData insert: success!");
                            // contactData returns object already parsed from json file in response
                            if (json && json.d) {
                                // now always edit!
                                json.d.Flag_NoEdit = AppRepl.replicator && AppRepl.replicator.inFastRepl;
                                that.setDataContact(json.d);
                                setRecordId(that.binding.dataContact.KontaktVIEWID);
                                AppData.getUserData();
                            }
                            complete(json);
                        }, function (errorResponse) {
                            AppBar.busy = false;
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            AppData.setErrorMsg(that.binding, errorResponse);
                            error(errorResponse);
                        }, dataContact);
                    }
                } else if (AppBar.busy) {
                    ret = WinJS.Promise.timeout(100).then(function() {
                        return that.saveData(complete, error);
                    });
                } else {
                    ret = new WinJS.Promise.as().then(function () {
                        complete(dataContact);
                    });
                }*/
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
