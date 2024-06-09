$(document).ready(function(){


    document.getElementById('loginForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent default form submission behavior
      
      // Serialize form data into JSON format
      const formData = JSON.stringify(Object.fromEntries(new FormData(this)));
      
      // Send POST request to server
      fetch('/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: formData
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
            //   alert(data.message);
                if (data.role=='Teacher'){
                    window.location.href='/t_home'; 
                }
                if (data.role=='Student'){
                    window.location.href='/home'; 
                }
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