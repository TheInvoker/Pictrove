/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

<script src="/js/jquery-3.0.0.min.js"></script>

    <style>
.content {
    height:100px;
    background-color:cyan;
    margin:20px;
    box-sizing:border-box;
}
</style>

<script>
$(document).ready(function() {
    $(".content:gt(0)").hide();
    $(".navigation button").click(function() {
        var id = $(this).attr("id");
        $(".content:visible").hide();
        $(".content[data-id='" + id + "']").show();
    });
});
</script>

</head>

<body>
<form method="post" action="/upload" enctype="multipart/form-data">
    <input type="file" name="pic" accept="image/*" capture="camera">
    <input type="submit" value="Upload">
    </form>

    <table class="menu">
    <tr>
    <td>
    <button id="tab1">tab1</button>
    </td>
    <td>
    <button id="tab2">tab2</button>
    </td>
    <td>
    <button id="tab3">tab3</button>
    </td>
    <td>
    <button id="tab4">tab4</button>
    </td>
    </tr>
    </table>

    <div class="content" data-id="tab1">
    1
    </div>
    <div class="content" data-id="tab2">
    2
    </div>
    <div class="content" data-id="tab3">
    3
    </div>
    <div class="content" data-id="tab4">
    4
    </div>/**
 * Created by user on 6/11/16.
 */
/**
 * Created by user on 6/11/16.
 */
