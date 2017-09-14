module.exports = function (app) {
    var todoList = require('../controllers/tallyUpdateController');
    console.log("i am in routes")
    // todoList Routes
    app.route('/updateTally')
        .post(todoList.updateTally);
};
