
$(document).ready(function() {
    // console.log("Document is ready."); // Check if document is ready
    
    $('.DeletePlaylistForm').submit(function(event) {
        // console.log("Form submitted."); // Check if form is submitted
        event.preventDefault(); // Prevent default form submission behavior
        
        // Serialize form data
        const formData = $(this).serialize();
        
        // console.log("form Data =>",formData);
        // Send POST request to server
        $.post('/t_playlist', formData)
        .done(function(data) {
            if (data.success) {
                alert(data.message);
                window.location.reload();
                // window.location.href='/t_home'; 
            } else {
                alert(data.message);
            }
        })
        .fail(function(error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
});