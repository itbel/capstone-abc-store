const express = require("express");
//const app = express();
const server = express.Router();

const mongoose = require("mongoose");

let Model = require("../model/models");

/*******************************************************************
 *
 * User
 *
 *******************************************************************/

/**********************************
 *
 * Get user list
 *
 **********************************/

server.route("/user/get-users").get((req, res, next) => {
  Model.userModel().find({}, (err, data) => {
    if (err) {
      //console.log(`Failed to load all users : ${err}`);
      return next(err);
    } else res.json(data);
  });
});

/**********************************
 *
 * delete user
 *
 **********************************/

server.route("/user/delete-user/:id").delete((req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  Model.userModel().findByIdAndDelete(id, (err, doc) => {
    if (err) {
      //console.log("del err: " + err)
      return next(err);
    } else {
      //console.log("del success: " + id)
      return res.json(doc);
    }
  });
});

/**********************************
 *
 * LOGIN
 *
 **********************************/

server.route("/user/login").post((req, res, next) => {
  Model.userModel().findOne(
    { username: req.body.username, password: req.body.password },
    (err, doc) => {
      if (err) return next(err);
      else res.json(doc);
    }
  );
});

/**********************************
 *
 * Register
 *
 **********************************/

server.route("/user/add-user").post((req, res, next) => {
  //console.log(req.body)
  Model.userModel().create(req.body, (error, data) => {
    if (error) return next(error);
    else {
      res.json(data);
      //console.log('Successfully added to the database: \n ' + data)
    }
  });
});

/********************************************************************
 *
 * Item
 *
 ********************************************************************/
/**********************************
 *
 * Get Item List
 *
 **********************************/
server.route("/item/get-items").get((req, res, next) => {
  Model.itemModel().find({}, (err, data) => {
    if (err) {
      res.send("Something went wrong...");
    } else {
      res.json(data);
      //console.log(data)
    }
  });
});

/**********************************
 *
 * Add item
 *
 **********************************/

server.route("/item/add-item").put((req, res, next) => {
  //console.log(req.body)
  Model.itemModel().create(req.body, (error, data) => {
    if (error) return next(error);
    else {
      res.json(data);
      //console.log('Successfully added to the database: \n ' + data)
    }
  });
});

/**********************************
 *
 * Edit item
 *
 **********************************/

server.route("/item/edit-item/:id").put((req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  //  console.log(id)
  //  console.log(req.body)
  Model.itemModel().findByIdAndUpdate(
    id,
    req.body,
    { new: true },
    (err, data) => {
      if (err) {
        //console.log("update error: "+ err)
        return next(err);
      } else {
        //console.log("update success: " + data)
        return res.json(data);
      }
    }
  );
});

/**********************************
 *
 * Delete item
 *
 **********************************/

server.route("/item/delete-item/:id").delete((req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  Model.itemModel().findByIdAndDelete(id, (err, doc) => {
    if (err) {
      //console.log("del err: " + err)
      return next(err);
    } else {
      //console.log("del success: " + id)
      return res.json(doc);
    }
  });
});

/********************************************************************
 *
 * Invoices
 *
 ********************************************************************/

/**********************************
 *
 * Get Invoice List
 *
 **********************************/

server.route("/invoice/get-invoices").get((req, res, next) => {
  Model.invoiceModel().find({}, (err, doc) => {
    if (err) {
      //console.log("get err: " + err)
      return next(err);
    } else {
      //console.log("GET Invoice List...")
      return res.json(doc);
    }
  });
});

/**********************************
 *
 * add invoice
 *
 **********************************/

server.route("/invoice/add-invoice").put((req, res, next) => {
  console.log(req.body);
  Model.invoiceModel().create(req.body, (err, doc) => {
    if (err) return next(err);
    else {
      //console.log('Successfully added to the database: \n ' + doc)
      res.json(doc);
    }
  });
});

/********************************************************************
 *
 * SHIPMENTS?!
 *
 ********************************************************************/
/**********************************
 *
 * Receive Shipment
 *
 **********************************/

server.route("/receive-shipment").post((req, res, next) => {
  //console.log(req.body.vendor)
  Model.itemModel().findOne(
    { vendor: req.body.vendor, name: req.body.name },
    (err, doc) => {
      if (err) return next(err);
      else {
        //console.log(`Current Quantity: ${doc.quantity}`)
        //console.log(`Current Date: ${doc.lastShipment}`)
        if (doc !== null) {
          doc.quantity = parseInt(doc.quantity) + parseInt(req.body.quantity);
          doc.lastShipment = req.body.date;
          doc.save((err, doc) => {
            if (err) {
              console.log(`Receive Shipment error: ${err}`);
              return next(err);
            }
            Model.shipmentModel().create(req.body, (err, doc2) => {
              if (err) return next(err);
              else res.json(doc);
            });
          });
        } else {
          console.log(2);
          Model.itemModel().create(req.body, (err, doc2) => {
            if (err) return next(err);
            else {
              Model.shipmentModel().create(req.body, (err, doc3) => {
                if (err) return next(err);
                else res.json(doc3);
              });
            }
          });
        }
      }
    }
  );
});
/********************************************************************
 *
 * DEFECTIVES?!
 *
 ********************************************************************/
server.route("/return").get((req, res, next) => {
  Model.returnModel().find({}, (err, doc) => {
    if (err) return next(err);
    else res.json(doc);
  });
});

/**********************************
 *
 * Return to Vendor
 *
 **********************************/
server.route("/return/add-to-return-list").put((req, res, next) => {
  //console.log(req.body)
  Model.returnModel().create(req.body, (err, doc) => {
    if (err) return next(err);
    else res.json(doc);
  });
});

/**********************************
 *
 * Change Item Status
 *
 **********************************/
server.route("/return/change-status").patch((req, res, next) => {
  //console.log(req.body)
  const id = mongoose.Types.ObjectId(req.body._id);
  Model.returnModel().findById(id, (err, doc) => {
    if (err) return next(err);
    else {
      doc.status = req.body.status;
      //console.log(doc)
      doc.save((err, doc1) => {
        //console.log(doc.status)
        if (err) return next(err);
        else res.json(doc1);
      });
    }
  });
});

/********************************************************************
 *
 * Item Requests?!
 *
 ********************************************************************/
/**********************************
 *
 * Get request list
 *
 **********************************/
server.route("/request").get((req, res, next) => {
  Model.requestModel().find({}, (err, doc) => {
    if (err) return next(err);
    else res.json(doc);
  });
});
/**********************************
 *
 * add request item
 *
 **********************************/
server.route("/request/add-item-request").put((req, res, next) => {
  Model.requestModel().create(req.body, (err, doc) => {
    if (err) return next(err);
    else res.json(doc);
  });
});
/**********************************
 *
 * edit request status
 *
 **********************************/
server.route("/request/change-status").patch((req, res, next) => {
  const id = mongoose.Types.ObjectId(req.body._id);
  Model.requestModel().findById(id, (err, doc) => {
    if (err) return next(err);
    else {
      doc.status = req.body.status;
      doc.save((err, doc1) => {
        if (err) return next(err);
        else res.json(doc1);
      });
    }
  });
});
/********************************************************************
 *
 * Statistics?!
 *
 ********************************************************************/
/**********************************
 *
 * get item statistics
 *
 **********************************/
server.route("/statistics/get-item-statistics").post((req, res, next) => {
  // Promise.all([
  //     Model.itemModel().find({name:req.body.name, vendor: req.body.vendor}, 'quantity', (err, doc) => {
  //         if(err) next(err)
  //         stat.currCount = doc
  //     }),
  //     Model.shipmentModel({name:req.body.name, vendor: req.body.vendor}, 'quantity date', (err, doc) => {
  //         if(err) next(err)
  //         stat.shipmentData = doc
  //     }),
  //     Model.returnModel({name:req.body.name, vendor: req.body.vendor}, 'status',(err, doc) => {
  //         if(err) next(err)
  //         stat.returnData = doc
  //     }),
  //     Model.requestModel({name:req.body.name, vendor: req.body.vendor}, 'date quantity status',(err, doc) => {
  //         if(err) next(err)
  //         stat.requestData = doc
  //     })
  // ]).then((result)=>{
  //     console.log(result)
  // })
  Promise.all([
    Model.itemModel().find(
      { name: req.body.name, vendor: req.body.vendor },
      "quantity"
    ),
    Model.shipmentModel().find(
      { name: req.body.name, vendor: req.body.vendor },
      "quantity date"
    ),
    Model.returnModel().find(
      { name: req.body.name, vendor: req.body.vendor },
      "status"
    ),
    Model.requestModel().find(
      { name: req.body.name, vendor: req.body.vendor },
      "quantity status"
    ),
  ]).then((result) => {
    let stat = {};
    stat.currData = result[0];
    stat.shipmentData = result[1];
    stat.returnData = result[2];
    stat.requestData = result[3];
    res.json(stat);
  });
  //console.log(req.body)
  //stat = await Model.returnModel().find({name:req.body.name, vendor:req.body.vendor}),
});
module.exports = server;
