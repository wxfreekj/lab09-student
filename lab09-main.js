// Lab 9: Weather Forecasting - Main JavaScript
// ESCI 240

document.addEventListener('DOMContentLoaded', function() {
    console.log('Lab 9: Weather Forecasting initialized');
    
    // Initialize progress tracking
    initializeProgressTracking();
    
    // Initialize form export
    setupFormExport();
});

function initializeProgressTracking() {
    const inputs = document.querySelectorAll('input, textarea, select');
    const progressBar = document.getElementById('progressBar');
    
    function updateProgress() {
        let filled = 0;
        inputs.forEach(input => {
            if (input.value.trim() !== '') {
                filled++;
            }
        });
        
        const percentage = (filled / inputs.length) * 100;
        progressBar.style.width = percentage + '%';
    }
    
    inputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
    });
    
    updateProgress();
}

function setupFormExport() {
    const exportBtn = document.getElementById('exportBtn');
    const exportStatus = document.getElementById('exportStatus');
    
    if (!exportBtn) {
        console.error('Export button not found');
        return;
    }
    
    exportBtn.addEventListener('click', function() {
        try {
            const formData = collectFormData();
            const textContent = formatAnswers(formData);
            downloadTextFile(textContent, 'Lab09_WeatherForecasting.txt');
            
            exportStatus.textContent = '✓ Lab forecasts exported successfully!';
            exportStatus.style.color = '#059669';
            
            setTimeout(() => {
                exportStatus.textContent = '';
            }, 5000);
        } catch (error) {
            console.error('Export error:', error);
            exportStatus.textContent = '✗ Error exporting forecasts. Please try again.';
            exportStatus.style.color = '#dc2626';
        }
    });
}

function collectFormData() {
    const formData = {
        studentName: '',
        labTitle: 'Lab 9: Simplified Guide to Weather Forecasting',
        totalPoints: 30,
        answers: {}
    };
    
    // Question 1: Wisconsin (10 pts)
    formData.answers.q1 = {
        question: 'Question 1: Forecast for Wisconsin (10 pts)',
        temperature: document.getElementById('q1-temp')?.value || '',
        windDirection: document.getElementById('q1-wind')?.value || '',
        precipitation: document.getElementById('q1-precip')?.value || '',
        explanation: document.getElementById('q1-explain')?.value || ''
    };
    
    // Question 2: Oklahoma (10 pts)
    formData.answers.q2 = {
        question: 'Question 2: Forecast for Oklahoma (10 pts)',
        temperature: document.getElementById('q2-temp')?.value || '',
        windDirection: document.getElementById('q2-wind')?.value || '',
        precipitation: document.getElementById('q2-precip')?.value || '',
        explanation: document.getElementById('q2-explain')?.value || ''
    };
    
    // Question 3: Alabama (10 pts)
    formData.answers.q3 = {
        question: 'Question 3: Forecast for Alabama (10 pts)',
        temperature: document.getElementById('q3-temp')?.value || '',
        windDirection: document.getElementById('q3-wind')?.value || '',
        precipitation: document.getElementById('q3-precip')?.value || '',
        explanation: document.getElementById('q3-explain')?.value || ''
    };
    
    return formData;
}

function formatAnswers(formData) {
    let text = '='.repeat(70) + '\n';
    text += 'ESCI 240 - ' + formData.labTitle + '\n';
    text += 'Total Points: ' + formData.totalPoints + '\n';
    text += 'Submission Date: ' + new Date().toLocaleString() + '\n';
    text += '='.repeat(70) + '\n\n';
    
    // Student Name
    text += 'Student Name: ' + (formData.studentName || '[Enter your name]') + '\n';
    text += '='.repeat(70) + '\n\n';
    
    // Question 1: Wisconsin
    text += formData.answers.q1.question + '\n';
    text += '-'.repeat(70) + '\n';
    text += 'Temperature (F): ' + formData.answers.q1.temperature + '\n';
    text += 'Wind Direction: ' + formData.answers.q1.windDirection + '\n';
    text += 'Precipitation/Severe Weather: ' + formData.answers.q1.precipitation + '\n';
    text += 'Explanation:\n' + formData.answers.q1.explanation + '\n\n';
    
    // Question 2: Oklahoma
    text += formData.answers.q2.question + '\n';
    text += '-'.repeat(70) + '\n';
    text += 'Temperature (F): ' + formData.answers.q2.temperature + '\n';
    text += 'Wind Direction: ' + formData.answers.q2.windDirection + '\n';
    text += 'Precipitation/Severe Weather: ' + formData.answers.q2.precipitation + '\n';
    text += 'Explanation:\n' + formData.answers.q2.explanation + '\n\n';
    
    // Question 3: Alabama
    text += formData.answers.q3.question + '\n';
    text += '-'.repeat(70) + '\n';
    text += 'Temperature (F): ' + formData.answers.q3.temperature + '\n';
    text += 'Wind Direction: ' + formData.answers.q3.windDirection + '\n';
    text += 'Precipitation/Severe Weather: ' + formData.answers.q3.precipitation + '\n';
    text += 'Explanation:\n' + formData.answers.q3.explanation + '\n\n';
    
    text += '='.repeat(70) + '\n';
    text += 'END OF LAB 9\n';
    text += '='.repeat(70) + '\n';
    
    return text;
}

function downloadTextFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
