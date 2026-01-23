const cron = require("node-cron");
//for dates use the date-fns package
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");
const { sendEmail } = require("../utils/emailService");

cron.schedule("0 8 * * *", async () => {
  try {
    //Dates of yesterday
    //yesterday
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    //fetch the data from the connectionRequest of yesterday and send the emails to the user(pending requests)
    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");
    //unique emails for sending requests
    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.email)),
    ];
    for (const email of listOfEmails) {
      //find the user in the pendingRequest
    //   console.log(email)
      const userData = pendingRequests.filter(
        (req) => req.toUserId.email === email
      );
      //console the values
      const toUserName = userData[0].toUserId.firstName;
    //   console.log(toUserName);
      //send the emial to the toUser
      const text = "Visit to devTinder You got New Friend requests";
      await sendEmail(toUserName, email, text); 
    }
  } catch (error) {
    console.log(
      `Error Coming from the CronJob Sending Emails : ${error.message}`
    );
  }
});
