$(document).ready(function(){

	var $model = $("#myModal");

	$('.navbar-toggle').click(function(){
		$(this).toggleClass('open');
		$('.navbar-header').toggleClass('open');
	});

	if($(this).width() < 767){
		$('.nav-link').removeClass('nav-buyer');
		$('.nav-link').removeClass('nav-seller');
	};

	// For Address proof button

	// To trigger click for input type=file for hidden tag

	$(document).on('click', '.custom-upload-address-button', function(){
		$('#upload-address-proof').trigger('click');
	});

	$(document).on('click', '.lan_switch', function(){
		var language = $(this).attr("data-value");
		var locationArray = window.location.href.split("/");
		var currentPage = locationArray[locationArray.length - 1];
		localStorage.setItem("language", language);
		location.replace("/" + language + "/" + currentPage);
	})

	// To change the DOM for bringing the uploaded file name and remove button

	$(document).on('change', '#upload-address-proof', function(){
		var customUploadSection = $('.custom-upload-address-section'),
		filePath = $(this).val(),
		filePathName = getFileName(filePath);

		if( filePath && filePathName ) {
			customUploadSection.html('');
			var customUploadFile = $('<span class="custom-upload-address-file">');
			customUploadSection.append(customUploadFile.text(filePathName));	
			customUploadSection.append($('<i class="fa fa-remove fa-2x custom-fa"></i>'));
		}
	});

	// To revert back the DOM struture if remove button is hit to remove the uploaded file

	$(document).on('click', '.custom-upload-address-section .custom-fa', function() {
		var customUploadSection = $('.custom-upload-address-section');

		$('#upload-address-proof').val('');
		customUploadSection.html('');
		customUploadSection.append($('<span class="custom-upload-address-button">Upload a file  <i class="fa fa-upload"></i></span>'))
	});

	// For Identity Proof

	// To trigger click for input type=file for hidden tag

	$(document).on('click', '.custom-upload-identity-button', function(){
		$('#upload-identity-proof').trigger('click');
	});

	// To change the DOM for bringing the uploaded file name and remove button

	$(document).on('change', '#upload-identity-proof', function(){
		var customUploadSection = $('.custom-upload-identity-section'),
			filePath = $(this).val(),
			filePathName = getFileName(filePath);

		if( filePath && filePathName ) {
			customUploadSection.html('');
			var customUploadFile = $('<span class="custom-upload-identity-file">');
			customUploadSection.append(customUploadFile.text(filePathName));	
			customUploadSection.append($('<i class="fa fa-remove fa-2x custom-fa"></i>'));
		}
	});

	// To revert back the DOM struture if remove button is hit to remove the uploaded file

	$(document).on('click', '.custom-upload-identity-section .custom-fa', function() {
		var customUploadSection = $('.custom-upload-identity-section');

		$('#upload-identity-proof').val('');
		customUploadSection.html('');
		customUploadSection.append($('<span class="custom-upload-identity-button">Upload a file  <i class="fa fa-upload"></i></span>'))
	});

	$(document).on('click', '.contactus-form-submit-btn', function(req, res){
		var formdata = {};
		formdata.firstname = $('#first-name').val();
		formdata.lastname = $('#last-name').val();
		formdata.email = $('#email').val();
		formdata.phoneno = $('#phone').val();
		formdata.message = $('#message').val();
		$.ajax({
			method: 'post',
			url: '/sendcontentform',
			data: formdata,
			dataType: 'json',
			success: function(res) {
				openModel(res.status, res.message);
				$('#myBtn').trigger('click');
				
			}
		})
	});

	$(document).on('click', '.buyersform-submit', function(req, res){
		var formdata = {};
		formdata.name = $('#buyersform-name').val();
		formdata.businessname = $('#buyersform-business-name').val();
		formdata.email = $('#buyersform-email').val();
		formdata.dob = $('#buyersform-dob').val();
		$.ajax({
			method: 'post',
			url: '/sendbuyerform',
			data: formdata,
			dataType: 'json',
			success: function(res) {
				openModel(res.status, res.message);
				$('#myBtn').trigger('click');
			}
		})
	});



	$(document).on('click', '.sellersform-submit', function(req, res){
		event.preventDefault();

        // Get form
        var form = $('#fileUploadForm')[0];

        // Create an FormData object 
        var data = new FormData(form);
		data.append('name', $("#sellersform-name").val());
		data.append('business_name', $("#sellersform-business-name").val());
		data.append('email', $("#sellersform-email").val());
		data.append('dob', $("#sellersform-dob").val());
		data.append('address', $("#sellersform-address").val());
		data.append('crop', $("#sellersform-typecrop").val());
		$.ajax({
			method: 'post',
			url: '/sendsellerform',
			data: data,
			contentType: false, 
			dataType: 'json',
			cache : false,
			processData: false,
			success: function(res) {
				openModel(res.status, res.message);
				$('#myBtn').trigger('click');
				console.log("seller form = ", res); 
			},
			error: function(err) {
				openModel(res.status, res.message);
				$('#myBtn').trigger('click');
				console.log("seller form err = ", err); 
			}
			
		})
	});

	////// Model //////////

	$(document).on('click', '#myBtn', function(){
		$model.show();
	})

	$(document).on('click', '.modal-content .close', function(){
		$model.hide();
	})

});


function getFileName (path) {
	var fileArray = path.split('\\');

	if (fileArray.length <= 0) {
		return '';
	}

	var fileName = fileArray[fileArray.length - 1];
	if (fileName.length > 30) {
		fileName = fileName.slice(0,30) + '...';
	}

	return fileName;
}

function openModel(status, message){
	if(status != "ok") {
		$("#myModal").find('.model-text').addClass('error');
	} else {
		$("#myModal").find('.model-text').removeClass('error');
	}
	$('.modal-content .model-text').html(message);
}
