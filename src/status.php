

<script src="https://www.gstatic.com/firebasejs/4.9.0/firebase.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.9.0/firebase-firestore.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCDPR6pEZ9UyKn1l_IxM8wojOlm8QNwZNQ",
    authDomain: "bankers-point-a82f2.firebaseapp.com",
    databaseURL: "https://bankers-point-a82f2.firebaseio.com",
    projectId: "bankers-point-a82f2",
    storageBucket: "bankers-point-a82f2.appspot.com",
    messagingSenderId: "638878172156"
  };
  firebase.initializeApp(config);
</script>


<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

include_once ("Instamojo\Instamojo.php");
$api = new Instamojo\Instamojo("test_aefcb9d7d18d4ec8ac568e581d0", "test_a4e95f47fe9bb5e281508f44233",'https://test.instamojo.com/api/1.1/');

$payment_id=$_GET['payment_id'];
$payment_request_id=$_GET['payment_request_id'];

try {
    $response = $api->paymentRequestPaymentStatus($payment_request_id, $payment_id);
    $isPaid = $response['payment']; // print status of payment

    if ($isPaid['status'] == "Credit") {
    	?>
    	<script type="text/javascript">
    		var courseId = "<?php echo $_GET['course_id']; ?>";
    		console.log(courseId);
    		var db=firebase.firestore();
    		firebase.auth().onAuthStateChanged(function(user){
    			if (user) {
    				db.doc("students/"+user.uid).collection("my_courses").doc(courseId).set({
    					date:Date.now()
    				}).then(function() {
					    console.log("Document successfully written!");
					})
					.catch(function(error) {
					    console.log("Error writing document: ", error);
					});
    			} else {
    				console.log("a ");
    			}
    		});
    	</script>
    	<?php
    } else {
    	echo "error";
    }


}
catch (Exception $e) {
    print('Error: ' . $e->getMessage());
}

?>