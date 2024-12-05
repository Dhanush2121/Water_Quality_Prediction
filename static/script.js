let lastPredictedValues = null;  // Store the last predicted input
let lastPredictionResult = null;  // Store the last prediction result
let randomValuesGenerated = null;  // Store the random values generated

// Manual input form submission
document.getElementById('manual-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const data = {
        ph: document.getElementById('ph').value,
        lead: document.getElementById('lead').value,
        mercury: document.getElementById('mercury').value,
        bacteria: document.getElementById('bacteria').value,
        arsenic: document.getElementById('arsenic').value,
    };

    // Check if the manually entered data matches the last random values
    if (randomValuesGenerated && JSON.stringify(data) === JSON.stringify(randomValuesGenerated)) {
        // If it matches, return the last random prediction result
        document.getElementById('result').innerHTML = `Recommended Nanomaterial: ${lastPredictionResult.nanomaterial} <br> Water Safety: ${lastPredictionResult.water_safety}`;
    } else {
        // Otherwise, proceed with normal prediction
        predictWithData(data);
    }
});

document.getElementById('generate-random').addEventListener('click', function () {
    randomValuesGenerated = {
        ph: (Math.random() * (9 - 6) + 6).toFixed(2),
        lead: (Math.random() * (0.1 - 0.01) + 0.01).toFixed(2),
        mercury: (Math.random() * (0.05 - 0.01) + 0.01).toFixed(2),
        bacteria: Math.floor(Math.random() * 1000),
        arsenic: (Math.random() * (0.05 - 0.01) + 0.01).toFixed(2),
    };

    // Display the random values on the screen
    document.getElementById('random-ph').innerText = randomValuesGenerated.ph;
    document.getElementById('random-lead').innerText = randomValuesGenerated.lead;
    document.getElementById('random-mercury').innerText = randomValuesGenerated.mercury;
    document.getElementById('random-bacteria').innerText = randomValuesGenerated.bacteria;
    document.getElementById('random-arsenic').innerText = randomValuesGenerated.arsenic;

    // Show predict button after generating random values
    document.getElementById('predict-random').style.display = 'block';
});

document.getElementById('predict-random').addEventListener('click', function () {
    // If random values are not changed, use the stored result
    if (randomValuesGenerated && JSON.stringify(randomValuesGenerated) === JSON.stringify(lastPredictedValues)) {
        document.getElementById('result').innerHTML = `Recommended Nanomaterial: ${lastPredictionResult.nanomaterial} <br> Water Safety: ${lastPredictionResult.water_safety}`;
        return;
    }

    // Predict with the newly generated random values
    predictWithData(randomValuesGenerated);
});

// Function to predict with given data (manual or random)
function predictWithData(data) {
    // If input hasn't changed, return the last prediction result
    if (JSON.stringify(data) === JSON.stringify(lastPredictedValues)) {
        document.getElementById('result').innerHTML = `Recommended Nanomaterial: ${lastPredictionResult.nanomaterial} <br> Water Safety: ${lastPredictionResult.water_safety}`;
        return;
    }

    // Send data for prediction
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            document.getElementById('result').innerHTML = `Error: ${result.error}`;
        } else {
            document.getElementById('result').innerHTML = `Recommended Nanomaterial: ${result.nanomaterial} <br> Water Safety: ${result.water_safety}`;

            // Store the current input and result to prevent re-predicting unless values change
            lastPredictedValues = data;
            lastPredictionResult = result;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = `An error occurred: ${error}`;
    });
}










