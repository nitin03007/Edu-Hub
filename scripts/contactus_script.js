$(document).ready(function(){


    document.getElementById('contactusForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        
        // Create FormData object to collect form data
        // const formData = new FormData(this);
        
        console.log("In the Script");
        // Send POST request to server
        // fetch('/contactus', {
        //     method: 'POST',
        //     body: formData
        // })
        // .then(response => response.json())
        // .then(data => {
        //     if (data.success) {
        //         console.log(data.message)
        //         alert(data.message);
        //         // window.location.href='/contactus'; 
        //     } else {
        //         console.log(data.message)
        //         alert(data.message);
        //     }
        // })
        // .catch(error => {
        //     console.error('Error:', error);
        //     alert('An error occurred. Please try again later.');
        // });



    //     emailjs
    // .send(
    //   "service_0sky6do",
    //   "template_5zptrts",
    //   {
    //     from_name: name,
    //     from_email: email,
    //     phone_number: phone,
    //     message: message,
    //   },
    //   'TDfqTALbUgjq5cvEE' // Your user ID from EmailJS
    // )
    // .then((response) => {
    //   console.log('Email sent:', response.status, response.text);
    //   return res.status(200).json({ success: true, message: "Email Sent" });
    // })
    // .catch((error) => {
    //   console.error('Error sending email:', error);
    //   return res.status(500).json({ success: false, message: "Email Not Sent !!, Try again!!" });
    // });

        try{
            var param={
                from_name : document.getElementById('name').value,
                email_id: document.getElementById('email').value,
                phone_number: document.getElementById('phone').value,
                message: document.getElementById('msg').value
            }
            emailjs.send("service_0qzwf0p","template_lstl5vg",param).then(function(res){
                alert("Email Sent "+res.status);
            })
        }
        catch(error){
            console.log("Error: ",error);
            alert("Try Again!!");
        }
    


    });
    
    
    
    
    });