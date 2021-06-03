const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
	email: String,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription