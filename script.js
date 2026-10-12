// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all tabs and buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Initialize all charts
    initializeCharts();

    // Initialize prediction form
    initializePredictionForm();
});

// Chart Initialization
function initializeCharts() {
    // Model Performance Comparison Chart
    const modelComparisonCtx = document.getElementById('modelComparisonChart').getContext('2d');
    new Chart(modelComparisonCtx, {
        type: 'bar',
        data: {
            labels: ['Logistic Regression', 'SVM', 'Random Forest'],
            datasets: [
                {
                    label: 'Accuracy (%)',
                    data: [75.11, 28.69, 100.00],
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
                },
                {
                    label: 'F1-Score (%)',
                    data: [75.24, 24.30, 100.00],
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });

    // Fault Distribution Pie Chart
    const faultDistributionCtx = document.getElementById('faultDistributionChart').getContext('2d');
    new Chart(faultDistributionCtx, {
        type: 'pie',
        data: {
            labels: ['Normal', 'Warning', 'Fault'],
            datasets: [{
                data: [226, 214, 34],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });

    // Feature Importance Chart
    const featureImportanceCtx = document.getElementById('featureImportanceChart').getContext('2d');
    new Chart(featureImportanceCtx, {
        type: 'bar',
        data: {
            labels: [
                'Residual (%)',
                'Estimated SOC (%)',
                'Ground Truth SOC (%)',
                'Voltage (V)',
                'Current (A)',
                'Temperature (°C)',
                'Motor Speed (RPM)',
                'Hall Code'
            ],
            datasets: [{
                label: 'Importance',
                data: [0.35, 0.25, 0.20, 0.08, 0.05, 0.04, 0.02, 0.01],
                backgroundColor: '#8b5cf6',
                borderColor: '#7c3aed',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 0.4
                }
            }
        }
    });

    // Battery Metrics Timeline Chart
    const batteryMetricsCtx = document.getElementById('batteryMetricsChart').getContext('2d');
    new Chart(batteryMetricsCtx, {
        type: 'line',
        data: {
            labels: ['0ms', '100ms', '200ms', '300ms', '400ms'],
            datasets: [
                {
                    label: 'Voltage (V)',
                    data: [3.65, 3.59, 3.66, 3.75, 3.58],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Current (A)',
                    data: [3.74, 2.33, 1.23, 2.50, 4.78],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Temperature (°C)',
                    data: [21.5, 35.3, 31.0, 38.2, 33.1],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Prediction Form Handler
function initializePredictionForm() {
    const form = document.getElementById('predictionForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            voltage: parseFloat(document.getElementById('voltage').value),
            current: parseFloat(document.getElementById('current').value),
            temperature: parseFloat(document.getElementById('temperature').value),
            motorSpeed: parseInt(document.getElementById('motorSpeed').value),
            estimatedSOC: parseFloat(document.getElementById('estimatedSOC').value),
            groundTruthSOC: parseFloat(document.getElementById('groundTruthSOC').value),
            residual: parseFloat(document.getElementById('residual').value),
            hallCode: parseInt(document.getElementById('hallCode').value)
        };

        // Make prediction
        const prediction = predictFault(formData);
        
        // Display result
        displayPredictionResult(prediction);
    });
}

// Prediction Logic (Rule-based for demonstration)
function predictFault(data) {
    const residual = Math.abs(data.residual);
    
    let result = {
        label: '',
        confidence: 0,
        class: '',
        icon: ''
    };

    // Simple rule-based prediction
    // In production, this would call your ML model API
    if (residual > 3.5) {
        result.label = 'Fault';
        result.confidence = 92;
        result.class = 'fault';
        result.icon = 'fa-battery-quarter';
    } else if (residual > 2.0) {
        result.label = 'Warning';
        result.confidence = 85;
        result.class = 'warning';
        result.icon = 'fa-exclamation-triangle';
    } else {
        result.label = 'Normal';
        result.confidence = 95;
        result.class = 'normal';
        result.icon = 'fa-check-circle';
    }

    return result;
}

// Display Prediction Result
function displayPredictionResult(prediction) {
    const resultDiv = document.getElementById('predictionResult');
    const resultLabel = document.getElementById('resultLabel');
    const resultConfidence = document.getElementById('resultConfidence');
    const resultIcon = document.getElementById('resultIcon');

    // Update content
    resultLabel.textContent = prediction.label;
    resultConfidence.textContent = `Confidence: ${prediction.confidence}%`;
    
    // Update icon
    resultIcon.className = `result-icon fas ${prediction.icon}`;

    // Update classes
    resultDiv.className = `prediction-result ${prediction.class}`;
    
    // Show result with animation
    resultDiv.classList.remove('hidden');
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// API Integration Function (for future use)
async function callPredictionAPI(data) {
    // Example API call structure
    // Replace with your actual API endpoint
    try {
        const response = await fetch('http://your-api-endpoint/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Prediction API error');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error calling prediction API:', error);
        return null;
    }
}

// Auto-calculate residual when SOC values change
document.addEventListener('DOMContentLoaded', function() {
    const estimatedSOC = document.getElementById('estimatedSOC');
    const groundTruthSOC = document.getElementById('groundTruthSOC');
    const residual = document.getElementById('residual');

    function updateResidual() {
        const estimated = parseFloat(estimatedSOC.value) || 0;
        const groundTruth = parseFloat(groundTruthSOC.value) || 0;
        const calculatedResidual = (estimated - groundTruth).toFixed(1);
        residual.value = calculatedResidual;
    }

    estimatedSOC.addEventListener('input', updateResidual);
    groundTruthSOC.addEventListener('input', updateResidual);
});

// Sample data loading function
function loadSampleData(sampleType) {
    const samples = {
        normal: {
            voltage: 3.65,
            current: 3.74,
            temperature: 21.5,
            motorSpeed: 1350,
            estimatedSOC: 88.7,
            groundTruthSOC: 87.7,
            residual: 1.0,
            hallCode: 111
        },
        warning: {
            voltage: 3.75,
            current: 2.50,
            temperature: 38.2,
            motorSpeed: 1320,
            estimatedSOC: 92.9,
            groundTruthSOC: 90.6,
            residual: 2.3,
            hallCode: 0
        },
        fault: {
            voltage: 3.45,
            current: 5.20,
            temperature: 42.5,
            motorSpeed: 1400,
            estimatedSOC: 85.0,
            groundTruthSOC: 81.0,
            residual: 4.0,
            hallCode: 999
        }
    };

    const sample = samples[sampleType];
    if (sample) {
        Object.keys(sample).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = sample[key];
            }
        });
    }
}

// Export data function
function exportResults() {
    // Implement export functionality
    console.log('Exporting results...');
    // This could export charts, predictions, etc. as PDF or CSV
}