const Joi = require("@hapi/joi");
const actions = require("./actions");
const shortId = require("shortid");
const { sendEmail } = require("../helpers/email-sender");

class Validations {
  validateRequest = (req, res, next) => {
    const rules = Joi.object({
      name: Joi.string(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      subscription: Joi.string(),
    });
    const validationResult = rules.validate(req.body);
    if (validationResult.error) {
      return res.status(422).json({ message: "Missing required field" });
    }
    next();
  };
  validateSignIn = (req, res, next) => {
    const rules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationResult = rules.validate(req.body);
    if (validationResult.error) {
      return res.status(422).json({ message: "Missing required field" });
    }
    next();
  };
  validateOtpCode = async (req, res, next) => {
    try {
      const { email } = req.query;
      const { otpCode } = req.body;
      const user = await actions.findEmail(email);
      const id = user._id;
      const isOtpCode = user.otpCode === otpCode;

      if (user && isOtpCode) {
        res.send("Verification is complete!");
        req.user = user;
        next();
      } else {
        const newOtpCode = shortId();
        await actions.findAndUpdate(id, { otpCode: newOtpCode });
        const msg = {
          to: email,
          from: "serbin_y@ukr.net",
          subject: "Verification email",
          html: `<p>For complete verification  enter the code ${newOtpCode} again :)</p><form action='http://localhost:3001/api/otp?email=${email}' method="post"><input  name="otpCode" placeholder="Enter code"></input><button type="submit">Click to confirm</button></form>`,
        };
        sendEmail(msg);
        return res.send(
          "Error verification!:( Please, try again in new email !"
        );
      }
    } catch (error) {
      next(error);
    }
  };
}
module.exports = new Validations();
