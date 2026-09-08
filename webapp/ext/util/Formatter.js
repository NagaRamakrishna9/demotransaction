sap.ui.define([], function () {
    "use strict";

    var FAILED_STATUSES = ["Validation Failed", "Posting Failed", "Blocked"];
    var WAITING_STATUSES = ["Awaiting Coding", "Awaiting Approval"];

    var Formatter = {

        // ---- Status column ----
        statusState: function (sStatus) {
            if (sStatus === "Posted") { return "Success"; }
            if (FAILED_STATUSES.indexOf(sStatus) > -1) { return "Error"; }
            if (WAITING_STATUSES.indexOf(sStatus) > -1) { return "Warning"; }
            return "None";
        },

        statusIcon: function (sStatus) {
            if (sStatus === "Posted") { return "sap-icon://accept"; }
            if (FAILED_STATUSES.indexOf(sStatus) > -1) { return "sap-icon://decline"; }
            if (WAITING_STATUSES.indexOf(sStatus) > -1) { return "sap-icon://pending"; }
            return "sap-icon://question-mark";
        }
    };

    return Formatter;
});