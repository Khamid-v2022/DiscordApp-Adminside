// models
import Payments from "../model/Payment.js";
import Link from "../model/Link.js";
import Member from "../model/Member.js";
import Balance from "../model/Balance.js";

import Invite from '../model/Invite.js';

async function getPayments(req, res) {
  try {
    const response = await Payments.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userid",
          foreignField: "userid",
          as: "user_data",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$user_data", 0] }, "$$ROOT"],
          },
        },
      },
      { $project: { user_data: 0 } },
      {
        $project: { username: 1, trxid: 1, amount: 1, package: 1, stars:1, diamonds: 1, trx_time: 1 },
      },
      { $sort : { trx_time : -1 } }
    ]);
    res.send(response);
  } catch (error) {
    console.log({ message: error.message });
    res.json({ message: error.message });
  }
}

async function getChart(req, res) {
  try {
    let lastweek = new Date().getDate() - 7; // deducting 7 days
    let lastWeekDate = new Date();
    lastWeekDate.setDate(lastweek);

    const response = await Link.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $gte: ["$expire_at", new Date(lastWeekDate).toISOString()] },
            ],
          },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$expire_at" },
          sales: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          sales: 1,
        },
      },
    ]);

    res.send(response);
  } catch (error) {
    console.log({ message: error.message });
    res.json({ message: error.message });
  }
}

async function addTransaction(req, res){
  const { user_name, pac, amount, stars, diamonds, note } = req.body;
  
  // get User info
  const user = await Member.findOne({ username: user_name });
  console.log(user);
  
  if(user){
    const result = await Balance.findOneAndUpdate(
      { userid: user.userid },
      { $inc: { "purchased.stars": stars, "purchased.diamonds": diamonds }},
      { new: true }
    );

    // storing data
    const packageDetails = new Payments({
      trxid: "Admin pay",
      userid: user.userid,
      amount: amount,
      package: pac,
      stars: stars,
      diamonds: diamonds,
      note: note
    });
    const paymentResponse = await packageDetails.save();
    res.send({ status: 200, message: "Success to add" });
  } else {
    res.send({ status: 401, message: "No user" });
  }
  
 
}

async function totalSale(req, res) {
  try {
    const response = await Payments.aggregate([
      { $group: { _id:null, sum_val: {$sum: "$amount"} } }
    ]);

    res.send(response);
  } catch (error) {
    res.json({ message: error.message });
  }
}

async function totalCampaign(req, res) {
  try {
    const response = await Invite.aggregate([
      { $group: { _id:null, sum_val: {$sum: "$target.total"} } }
    ]);
    console.log(response);
    res.send(response);
  } catch (error) {
    res.json({ message: error.message });
  }
}

const PaymentController = {
  getPayments,
  getChart,
  addTransaction,
  totalSale,
  totalCampaign
};

export default PaymentController;
