const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sketchSchema = new Schema({
	title: String,
    description: Array,
    img1: String,
    img2: String,
    sold: Boolean
});

const Sketch = mongoose.model('Sketch', sketchSchema);

module.exports = Sketch;
