sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/ui/model/json/JSONModel"
], function (ControllerExtension, JSONModel) {
    "use strict";

    return ControllerExtension.extend(
        "demotransactions.ext.controller.ListReportExt",
        {

            override: {
                onInit: function () {
                    const oView = this.base.getView();

                    const oKpiModel = new JSONModel({
                        totalTransactions: 0,
                        touchlessRate: 0,
                        touchlessCount: 0,
                        exceptions: 0,
                        awaitingApproval: 0,
                        averageAgeMinutes: 0
                    });
                    oView.setModel(oKpiModel, "kpi");

                    // Don't touch the OData model yet - it may not be
                    // propagated to the view at this point in the lifecycle.
                    // Wait for modelContextChange, then set up the binding once.
                    oView.attachEventOnce("modelContextChange", this._onModelReady, this);
                }
            },

            _onModelReady: function () {
                const oView = this.base.getView();
                const oModel = oView.getModel();

                if (!oModel) {
                    // Model still not there - try again on the next context change
                    oView.attachEventOnce("modelContextChange", this._onModelReady, this);
                    return;
                }

                this._oListBinding = oModel.bindList("/Transactions");
                this._fnDataReceived = this._calculateKPIs.bind(this);
                this._oListBinding.attachDataReceived(this._fnDataReceived);

                this._calculateKPIs();
            },

            onExit: function () {
                if (this._oListBinding) {
                    this._oListBinding.detachDataReceived(this._fnDataReceived);
                }
            },

            _calculateKPIs: async function () {
                const oView = this.base.getView();
                const oKpiModel = oView.getModel("kpi");

                try {
                    const aContexts = await this._oListBinding.requestContexts(0, 1000);
                    const aTransactions = aContexts.map((oCtx) => oCtx.getObject());

                    const iTotal = aTransactions.length;

                    const iAutoProcessed = aTransactions.filter(
                        (oItem) => oItem.AutoProcessed === true
                    ).length;

                    const iExceptions = aTransactions.filter((oItem) =>
                        ["Validation Failed", "Posting Failed", "Blocked"].includes(oItem.Status)
                    ).length;

                    const iAwaitingApproval = aTransactions.filter(
                        (oItem) => oItem.ApprovalStatus === "Pending"
                    ).length;

                    const fTouchlessRate = iTotal > 0
                        ? Math.round((iAutoProcessed / iTotal) * 1000) / 10
                        : 0;

                    oKpiModel.setData({
                        totalTransactions: iTotal,
                        touchlessCount: iAutoProcessed,
                        touchlessRate: fTouchlessRate,
                        exceptions: iExceptions,
                        exceptionState: iExceptions > 5 ? "Error" : (iExceptions > 0 ? "Critical" : "Good"),
                        awaitingApproval: iAwaitingApproval,
                        averageAgeMinutes: this._computeAverageAgeMinutes(aTransactions)
                    });

                } catch (oError) {
                    console.error("Error calculating KPIs", oError);
                }
            },

            _computeAverageAgeMinutes: function (aTransactions) {
                if (!aTransactions.length) { return 0; }

                const iTotalMinutes = aTransactions.reduce((iSum, oItem) => {
                    const sAge = oItem.ProcessingAge || "";
                    const oDay = sAge.match(/(\d+)\s*d/);
                    const oHour = sAge.match(/(\d+)\s*h/);
                    const oMin = sAge.match(/(\d+)\s*m/);

                    return iSum +
                        (oDay ? parseInt(oDay[1], 10) * 24 * 60 : 0) +
                        (oHour ? parseInt(oHour[1], 10) * 60 : 0) +
                        (oMin ? parseInt(oMin[1], 10) : 0);
                }, 0);

                return Math.round(iTotalMinutes / aTransactions.length);
            }
        }
    );
});