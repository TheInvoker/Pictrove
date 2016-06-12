function closeNav() {
    $(".sidenav").removeClass("openNavDrawer");
}

$(document).ready(function() {
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
				
				for(var i=0; i<data.tag_array.length; i+=1) {
					$(".img_tags_recognition").append("<div class='tag'>" + data.tag_array[i] + "</div>");
				}

				$(".img_sentiment").html("<div class='tag'>" + data.sentiment + "</div>");
			},
			error : function(request, status, error) {
				alert("error");
			},
			cache: false,
			contentType: false,
			processData: false
		});
		
		return false;
	});
	

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
});

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

