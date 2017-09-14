var mongoose = require('mongoose'),
    Tally = mongoose.model('Tally');
async = require('async');
// var collection = db.collection('invoice')

exports.updateTally = function (req, res) {
    console.log("req.body.result", req.body.result)
    var reqArray = req.body.result;
    var successInvoice = [];
    var failureInvoice = [];

    async.eachSeries(reqArray.importbill, function (n, callback) {
        if (n.failurereason[0] == "" && n.success[0] != "") {
            successInvoice.push(n.invoicenumber[0]);
        } else if (n.failurereason[0] != "" && n.success[0] == "") {
            var obj = {
                invoiceNumber: n.invoicenumber[0],
                failureReason: n.failurereason[0]
            }
            failureInvoice.push(obj);
        }
        callback();
    }, function (error) {
        if (error) {
            res.json("error");
        } else {

            async.parallel({
                successUpdate: function (cb) {

                    db.collection('invoices').update({
                        invoiceNumber: {
                            $in: successInvoice
                        }
                    }, {
                            $set: {
                                isTallySuccess: true,
                                failureReason: null
                            }
                        }, {
                            multi: true
                        }, function (error, invoiceUpdated) {
                            if (error) {
                                cb(error, null);
                            } else {
                                if (invoiceUpdated.nModified > 0) {
                                    cb(null, {
                                        message: "Invoice updated"
                                    });
                                } else {
                                    cb(null, {
                                        message: "Invoices not updated"
                                    });
                                }
                            }
                        });
                },
                errorUpdate: function (outerCB) {
                    async.eachSeries(failureInvoice, function (n, cb) {
                        db.collection('invoices').update({
                            invoiceNumber: n.invoiceNumber
                        }, {
                                $set: {
                                    isTallySuccess: false,
                                    failureReason: n.failureReason
                                }
                            }, function (error, invoiceUpdated) {
                                if (error) {
                                    cb(error, null);
                                } else {
                                    if (invoiceUpdated.nModified > 0) {
                                        cb(null, {
                                            message: "Invoice updated"
                                        });
                                    } else {
                                        cb(null, {
                                            message: "Invoices not updated"
                                        });
                                    }
                                }
                            });
                    }, function (err) {
                        if (err) {
                            outerCB(err, null);
                        } else {
                            outerCB(null, {
                                message: "Invoice updated"
                            });
                        }
                    })
                }
            }, function () {
                var resObj = {};
                resObj.success = successInvoice;
                resObj.failure = failureInvoice;
                res.json(resObj);
            })
        }
    })

    // db.collection('invoices').find({}).toArray(function (err, found) {
    //     // console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", err, found);
    //     if (err)
    //         res.send(err);
    //     res.json(found);
    // })
};
