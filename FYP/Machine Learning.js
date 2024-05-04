const brain = require('brain.js');
const fs = require('fs');

// Load preprocessed data
const rawData = fs.readFileSync('Limited Online Retail Historical.json', 'utf8');
const data = JSON.parse(rawData);

// Normalize the data
const maxSales = Math.max(...data.flatMap(item => [item['Week 1 Sales'], item['Week 2 Sales'], item['Week 3 Sales'], item['Week 4 Sales']]));
const trainingData = data.map(item => ({
    input: [item['Week 1 Sales'] / maxSales, item['Week 2 Sales'] / maxSales, item['Week 3 Sales'] / maxSales],
    output: [item['Week 4 Sales'] / maxSales]
}));

// Validate data to ensure there are no null or undefined values
const isValidData = item => item.input.every(x => x !== null && !isNaN(x)) && item.output.every(x => x !== null && !isNaN(x));
const validTrainingData = trainingData.filter(isValidData);

if (validTrainingData.length === 0) {
    throw new Error("No valid training data available. Check the input data for null values or inappropriate formats.");
}

// Create a simple feedforward neural network with one hidden layer
const net = new brain.NeuralNetwork({
    inputSize: 3,
    hiddenLayers: [5],
    outputSize: 1
});

// Train the network
net.train(validTrainingData, {
    iterations: 20000,
    errorThresh: 0.003,
    log: true,
    logPeriod: 1000,
    learningRate: 0.02,
    momentum: 0.2
});

// Using the network for a prediction
const normalizedOutput = net.run([0.5, 0.6, 0.7]);
console.log('Predicted output:', normalizedOutput[0] * maxSales);

// Save the trained model
const trainedModel = net.toJSON();
fs.writeFileSync('trainedModel.json', JSON.stringify(trainedModel));

console.log('Model trained and saved.');

function predict(input) {
    // Normalize the input in the same way as the training data
    const maxSales = Math.max(...data.flatMap(item => [item['Week 1 Sales'], item['Week 2 Sales'], item['Week 3 Sales'], item['Week 4 Sales']]));
    const normalizedInput = input.map(x => x / maxSales);
    const output = net.run(normalizedInput);
    return output[0] * maxSales;
}

module.exports = {
    predict
};
