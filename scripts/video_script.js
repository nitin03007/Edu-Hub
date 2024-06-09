$(document).ready(function(){


    document.getElementById('videoForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        
        // Create FormData object to collect form data
        const formData = new FormData(this);
        
        // Send POST request to server
        fetch('/v_upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                window.location.href='/t_home'; 
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
    
    
    
    
    });