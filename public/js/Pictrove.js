function showBlackShade() {
	var shade = $("<div class='black_shade'></div>").hide();
	$("body").append(shade);
	shade.fadeIn();
}
function removeBlackShade() {
	$(".black_shade").fadeOut();
}
function openNav() {
    $("#mySidenav").addClass("openNavDrawer");
	showBlackShade();
}
function closeNav() {
    $("#mySidenav").removeClass("openNavDrawer");
	removeBlackShade();
}
function openPopup() {
	$("body").append("<div class='popup_box'></div>");
	showBlackShade();
}
function closePopup() {
	$(".popup_box").remove();
	removeBlackShade();
}
function closeAll() {
	closeNav();
	closePopup();
	removeBlackShade();
}


function selectContent(tab_id) {
	$(".item a.selected").removeClass("selected");
	$(".header_link.selected").removeClass("selected");
	
	$(this).addClass("selected");
	$(".header_link[data-id='" + tab_id + "']").addClass("selected");
	
	$(".page_content:visible").hide();
	$(".page_content[data-id='" + tab_id + "']").show();
}

$(document).ready(function() {
	
	// click on the open nav button
    $(".open_nav_button").click(function() {
        openNav();
        return false;
    });

	// click on the close nav button
    $(".close_nav_button").click(function() {
        closeNav();
        return false;
    });
	
	
	
	// click on the back shade
	$("body").on('click', '.black_shade', function() {
		closeAll();
		return false;
	});
	
	
	
	// click on the menu
	$(".page_content").hide();
	$(".header_link").click(function() {
		if ($(this)[0].hasAttribute("data-id")) {
			var tab_id = $(this).attr("data-id");
			selectContent(tab_id);
			closeNav();
		}
		return false;
	});
	$(".header_link").eq(0).click();
	
	
	// click on the navigation drawer menu
	$(".item a").click(function() {
		if ($(this)[0].hasAttribute("data-id")) {
			var tab_id = $(this).attr("data-id");
			selectContent(tab_id);
			closeNav();
		}
		return false;
	});
	
	// click on the category picture
	$(".page_content[data-id='categories'] .picture_container").click(function() {
		if ($(this)[0].hasAttribute("data-id")) {
			var tab_id = $(this).attr("data-id");
			selectContent(tab_id);
			closeNav();
		}
		return false;
	});
	
	
	// click submit on the upload image form
	$(".form_container").hide();
    $('#imagefileinput').change(function(e) {
		$(".metadata").hide();
        var file = e.target.files[0],
            imageType = /image.*/;

        if (!file.type.match(imageType))
            return;

        var reader = new FileReader();
        reader.onload = fileOnload;
        reader.readAsDataURL(file);
    });
	
	
	// handle responsive menu
	var expanded = false;
	$(".menu_expand").click(function() {
		$(".account_container").animate({
			'height' : expanded ? '0px' : '80px'
		}, 500);
		$(".header_links").animate({
			'height' : expanded ? '0px' : ($(window).width() > 403 ? '80px' : '115px')
		}, 500);
		expanded = !expanded;
		return false;
	});
	$(window).resize(function(){
		var width = $(window).width();
		if (width > 971) {
			expanded = false;
			$(".header_links").css('height', '');
			$(".account_container").css('height', '');
		} else if (width > 403 && expanded) {
			$(".header_links").css('height', '80px');
			$(".account_container").css('height', '80px');
		} else if (expanded) {
			$(".header_links").css('height', '115px');
			$(".account_container").css('height', '80px');
		}
	});


	/*
    $(".table_container").hide();
    $(".navigation a").click(function() {
        var id = $(this).attr("id");
        if (id) {
            $(".table_container:visible").hide();
            $(".navigation a.selected").removeClass("selected");
            $(this).addClass("selected");
            var content = $(".table_container[data-id='" + id + "']");
            closeNav();
            content.show();
        }
        return false;
    });
    $(".sidenav a").click(function() {
        var id = $(this).attr("id");
        if (id) {
            $(".table_container:visible").hide();
            var content = $(".table_container[data-id='" + id + "']");
            closeNav();
            content.show();
        }
        return false;

    });
    $(".table_container a").click(function() {
        var id = $(this).attr("id");
        if (id) {
            $(".table_container:visible").hide();
            var content = $(".table_container[data-id='" + id + "']");
            content.show();
        }
        return false;
    });
    $(".navigation a").eq(0).click();

    $("body").click(function() {
        $(".popup_box").remove();
        closeNav();
    });
    $(".table_container[data-id='home'] img").click(function() {
        closeNav();
        var div = $("<div class=\"popup_box\"><img src='Photos/popup.png'></div>");
        $("body").append(div);
        return false;
    });

    $(".openbtn").click(function() {
        $(".sidenav").addClass("openNavDrawer");
        return false;
    });

    $(".closebtn").click(function() {
        closeNav();
        return false;
    });

	
	$(".upload_button").click(function() {
		closeNav();
		$('#canvas').hide();		
		$(".metadata").hide();
		$(".img_tags_recognition").empty();
		$(".img_sentiment").empty();
        $(".form_container").show('slow');
		$("#imagefileinput").val(''); 
	});

	$(".form_container form").submit(function() {
		$('#canvas').addClass("loading");
		var formData = new FormData($(this)[0]);
		$.ajax({
			url: '/upload',
			type: 'POST',
			data: formData,
			async: true,
			success: function (data) {
				//$(".form_container").hide('slow');
				var data = JSON.parse(data);

				$(".metadata").show();
				
				$(".img_tags_recognition").empty();
				for(var i=0; i<data.tag_array.length; i+=1) {
					$(".img_tags_recognition").append("<div class='tag'>" + data.tag_array[i] + "</div>");
				}

				$(".img_sentiment").html("<div class='tag'>" + data.sentiment + "</div>");
			},
			error : function(request, status, error) {
				alert("error");
			},
			complete : function() {
				$('#canvas').removeClass("loading");
			},
			cache: false,
			contentType: false,
			processData: false
		});
		
		return false;
	});
	*/


	
});

/*
    $('#imagefileinput').change(function(e) {
		$(".metadata").hide();
        var file = e.target.files[0],
            imageType = /image.*/;

        if (!file.type.match(imageType))
            return;

        var reader = new FileReader();
        reader.onload = fileOnload;
        reader.readAsDataURL(file);
    });
*/

function fileOnload(e) {
	var imageObj = $('<img>')[0];
    imageObj.onload = function() {
		$('#canvas').show();
		var canvas = $('#canvas')[0];
		var context = canvas.getContext('2d');

		canvas.width = imageObj.naturalWidth;
		canvas.height = imageObj.naturalHeight;
		context.drawImage(imageObj, 0, 0);
	};
	imageObj.src = e.target.result;
}

