const express = require("express")
const app = express()
require("dotenv").config()
const stripe = require("stripe")("sk_test_51N0v1YCwOWyVBlDMWC6YFPjMvjlMtAPqlHvV0kFUNR969WYIJCWvAGRYP1cyWlazHYdcf7JhKBOzOeTUUklGSX9o00UW2HBQ9E")
const bodyParser = require("body-parser")
const cors = require("cors")


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())

app.post("/payment", cors(), async (req, res) => {
	let { amount, id, description } = req.body
	try {
		const payment = await stripe.paymentIntents.create({
			amount,
			currency: "USD",
			description,
			payment_method: id,
			confirm: true
		})
		console.log("Payment", payment)
		res.json({
			message: "Payment successful",
			success: true
		})
	} catch (error) {
		console.log("Error", error)
		res.json({
			message: "Payment failed",
			success: false
		})
	}
})