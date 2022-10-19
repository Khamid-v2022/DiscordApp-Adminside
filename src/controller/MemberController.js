// models
import Balance from "../model/Balance.js";
import Member from "../model/Member.js";
import Payment from "../model/Payment.js";

async function getMembers(req, res) {
  try {
    const response = await Member.find({ role: "user" });
    // const response = await Member.aggregate([
    //   {
    //     $match: { role: "user" },
    //   }, 
    //   {
    //     $lookup: {
    //       from: "payments",
    //       localField: "userid",
    //       foreignField: "userid",
    //       as: "paid",
    //     },
    //   },
    //   {
    //     "$unwind": "$paid"
    //   },
    //   {
    //     $group: {
    //       _id: "$userid",
    //       totalSaleAmount: {$sum :"$paid.amount"},
    //     }
    //   },
    //   { $project : { userid : "$userid", email:"$email", username:"$username", totalSaleAmount : 1 } } 
    // ]);
   
    res.send(response);
  } catch (error) {
    console.log({ message: error.message });
    res.json({ message: error.message });
  }
}

async function getMember(req, res) {
  try {
    const { id } = req.params;
    // console.log(id);

    const response = await Member.aggregate([
      {
        $match: {
          $expr: {
            $eq: ["$_id", { $toObjectId: id }],
          },
        },
      },
      {
        $project: {
          uid: "$_id",
          _id: 0,
          username: 1,
          userid: 1,
          email: 1,
          status: 1,
          created_at: 1,
        },
      },
      {
        $lookup: {
          from: "earnings",
          localField: "userid",
          foreignField: "userid",
          as: "balance",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$balance", 0] }, "$$ROOT"],
          },
        },
      },
      {
        $project: {
          balance: 0,
        },
      },
      {
        $project: {
          stars: { $add: ["$purchased.stars", "$earned.stars"] },
          diamonds: { $add: ["$purchased.diamonds", "$earned.diamonds"] },
          username: 1,
          email: 1,
          status: 1,
          created_at: 1,
        },
      },
    ]);

    res.send(response[0]);
  } catch (error) {
    console.log({ message: error.message });
    res.json({ message: error.message });
  }
}

async function updateDiamonds(req, res) {
  try {
    const { id, amount } = req.body;

    const response = await Balance.findOneAndUpdate(
      { _id: id },
      { "purchased.diamonds": amount },
      { new: true }
    );

    res.send(response);
  } catch (error) {
    console.log({ message: error.message });
    res.json({ message: error.message });
  }
}

async function updateStars(req, res) {
  try {
    const { id, amount } = req.body;

    const response = await Balance.findOneAndUpdate(
      { _id: id },
      { "purchased.stars": amount },
      { new: true }
    );

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

    const response = await Member.aggregate([
      {
        $match: {
          created_at: { $gt: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) },
        },
      },

      {
        $group: {
          _id: { $dayOfMonth: "$created_at" },
          users: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          users: 1,
        },
      },
    ]);

    res.send(response);
  } catch (error) {
    console.log({ message: error.message });
    res.json({ message: error.message });
  }
}

const MemberController = {
  getMembers,
  getMember,
  getChart,
  updateStars,
  updateDiamonds,
};

export default MemberController;
