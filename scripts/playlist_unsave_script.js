$(document).ready(function() {
    $('.DeleteSavePlaylistForm').submit(function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        
        // Serialize form data
        const formData = $(this).serialize();
        
        // Send POST request to server
        $.post('/del_std_playlist', formData)
        .done(function(data) {
            if (data.success) {
                alert(data.message);
                window.location.reload();
            } else {
                alert(data.message);
            }
        })
        .fail(function(xhr, status, error) {
            console.error('Error:->>>>>>>', error);
            alert('An error occurred. Please try again later.');
        });
    });
});

