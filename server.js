var mysql = require("mysql");
var inquirer = require("inquirer");
// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
  // Your port; if not 3306
    port: 3306,
  // Your username
    user: "root",
  // Your password
    password: "1410Wilno",
    database: "employee_tracker"
});
// connect to the mysql server and sql database
connection.connect(function(err) {
    // if (err) throw err;
  // run the start function after the connection is made to prompt the user
    initialQuestions();
});
// function to handle posting new items up for auction
function initialQuestions() {
  // prompt for info about the item being put up for auction
    inquirer
        .prompt([
        {
        name: "membersChoice",
        type: "list",
        message: "What would you like to do?",
        choices:["View All Employees","View All By Department","View All By Manager",
        "Add Employee","Remove Employee","Update Employee Role","Update Employee Manager"]
        }
        // {
        // name: "category",
        // type: "input",
        // message: "What category would you like to place your auction in?"
        // },
        // {
        // name: "startingBid",
        // type: "input",
        // message: "What would you like your starting bid to be?",
        // }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
        // different credentials per role
            // let roleInfo = "";
            if (answer.membersChoice === "View All Employees") {
                var query = "SELECT * FROM employees";
                connection.query(query, function(err, res) {
                    if (err) throw err;
                    console.table(res);
                })
            }
            // else if (answer.membersChoice === "View All By Department"){ 
            //     addIntern();
            // } else if (answer.memberChoice === "View All By Manager"){
            //     return; 
            // }
                // var query = "SELECT * FROM employees";
                // connection.query(query, function(err, res) {
                //     if (err) throw err;
                //     console.table(res);
                //     }
    })
// function bidAuction() {
//   // query the database for all items being auctioned
//   connection.query("SELECT * FROM auctions", function(err, results) {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices: function() {
//             var choiceArray = [];
//             for (var i = 0; i < results.length; i++) {
//               choiceArray.push(results[i].item_name);
//             }
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?"
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?"
//         }
//       ])
//       .then(function(answer) {
//         // get the information of the chosen item
//         var chosenItem;
//         for (var i = 0; i < results.length; i++) {
//           if (results[i].item_name === answer.choice) {
//             chosenItem = results[i];
//           }
//         }
//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid
//               },
//               {
//                 id: chosenItem.id
//               }
//             ],
//             function(error) {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         }
//         else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// }
}