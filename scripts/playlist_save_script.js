$(document).ready(function() {
    $('.SavePlaylistForm').submit(function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        
        // Serialize form data
        const formData = $(this).serialize();
        
        // Send POST request to server
        $.post('/std_playlist', formData)
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














// $(document).ready(function() {
//     // console.log("Document is ready."); // Check if document is ready
    
//     $('.SavePlaylistForm').submit(function(event) {
//         // console.log("Form submitted."); // Check if form is submitted
//         event.preventDefault(); // Prevent default form submission behavior
        
//         // Serialize form data
//         const formData = $(this).serialize();
        
//         // console.log("form Data =>",formData);
//         // Send POST request to server
//         $.post('/std_playlist', formData)
//         .done(function(data) {
//             if (data.success) {
//                 alert(data.message);
//                 window.location.reload();
//                 // window.location.href='/t_home'; 
//             } else {
//                 alert(data.message);
//             }
//         })
//         .fail(function(error) {
//             console.error('Error:', error);
//             alert('An error occurred. Please try again later.');
//         });
//     });
// });