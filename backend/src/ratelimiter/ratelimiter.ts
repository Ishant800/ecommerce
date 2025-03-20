const ratelimit = require("express-rate-limit")

const authratelimit = ratelimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message:"to many request try later"
})
export default authratelimit