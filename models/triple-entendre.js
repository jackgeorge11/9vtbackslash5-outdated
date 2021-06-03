const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const manuscriptSchema = new Schema({
	title: String,
	sections: []
});

const Manuscript = mongoose.model('Manuscript', manuscriptSchema);

module.exports = Manuscript;

