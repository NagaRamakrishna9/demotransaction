sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"demotransactions/test/integration/pages/TransactionsList.gen",
	"demotransactions/test/integration/pages/TransactionsObjectPage.gen"
], function (JourneyRunner, TransactionsListGenerated, TransactionsObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('demotransactions') + '/test/flpSandbox.html#demotransactions-tile',
        pages: {
			onTheTransactionsListGenerated: TransactionsListGenerated,
			onTheTransactionsObjectPageGenerated: TransactionsObjectPageGenerated
        },
        async: true
    });

    return runner;
});

