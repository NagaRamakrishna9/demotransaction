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
        },

        // ---- Progress column (7-segment rule bar) ----
        _segmentColor: function (iIndex, sStatus, iProgress) {
            var iPassed = Math.round(((iProgress || 0) / 100) * 7);
            var bFailed = FAILED_STATUSES.indexOf(sStatus) > -1;
            var bWaiting = WAITING_STATUSES.indexOf(sStatus) > -1;

            if (iIndex < iPassed) { return "#2b7d2b"; }               // green - passed
            if (iIndex === iPassed && bFailed) { return "#bb0000"; }  // red - failed here
            if (iIndex === iPassed && bWaiting) { return "#e9730c"; } // amber - waiting on person
            return "#d9d9d9";                                        // grey - not yet run
        },

        segment0: function (s, p) { return Formatter._segmentColor(0, s, p); },
        segment1: function (s, p) { return Formatter._segmentColor(1, s, p); },
        segment2: function (s, p) { return Formatter._segmentColor(2, s, p); },
        segment3: function (s, p) { return Formatter._segmentColor(3, s, p); },
        segment4: function (s, p) { return Formatter._segmentColor(4, s, p); },
        segment5: function (s, p) { return Formatter._segmentColor(5, s, p); },
        segment6: function (s, p) { return Formatter._segmentColor(6, s, p); }
    };

    return Formatter;
});