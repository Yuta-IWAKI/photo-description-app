document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('photoSection').style.display = 'block';
    document.getElementById('startButton').style.display = 'none';
});

document.getElementById('photoInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById('photoPreview').src = reader.result;
            document.getElementById('photoPreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('submitButton').addEventListener('click', () => {
    const theme = document.getElementById('themeSelector').value;
    const photoSrc = document.getElementById('photoPreview').src;
    const description = document.getElementById('descriptionInput').value;

    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    resultItem.innerHTML = `
        <h3>${theme}</h3>
        <img src="${photoSrc}" alt="Submitted Photo">
        <p>${description}</p>
    `;
    document.getElementById('results').appendChild(resultItem);
    document.getElementById('resultsSection').style.display = 'block';

    // Clear the inputs
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('photoInput').value = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('photoSection').style.display = 'none';
    document.getElementById('startButton').style.display = 'block';
});
