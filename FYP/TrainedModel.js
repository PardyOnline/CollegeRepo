const brain = require('brain.js');
const fs = require('fs');

// Load the trained model
const trainedModel = JSON.parse(fs.readFileSync('trainedModel.json', 'utf8'));
const net = new brain.NeuralNetwork().fromJSON(trainedModel);

function predict(input) {
    // Normalize the input in the same way as the training data
    const maxSales = Math.max(...data.flatMap(item => [item['Week 1 Sales'], item['Week 2 Sales'], item['Week 3 Sales'], item['Week 4 Sales']]));
    const normalizedInput = input.map(x => x / maxSales);
    const output = net.run(normalizedInput);
    return output[0] * maxSales; // Scale back the output to the original scale
}

module.exports = {
    predict
};
