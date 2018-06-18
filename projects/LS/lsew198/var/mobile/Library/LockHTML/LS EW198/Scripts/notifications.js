window.addEventListener("load", function() {
    document.body.style.width='100%';
    document.body.style.height='100%';
}, false);

function notif(){
    if (groovyAPI.isShowingNotifications()){
    	$('#overlay,#R1,#R2,#Cal,#weekday').animate({opacity:'0'}, 200);
        $('#R3,#Clock').animate({'margin-top': ShiftUp_Notif + "%",}, 500);
    } else {
        $('#overlay,#R1,#R2,#Cal,#weekday,#R3,#Clock').animate({'margin-top': OriginalPos + "%",}, 500);
        $('#overlay').animate({opacity:'1'}, 700);
        $('#R1,#R2').animate({opacity:'0.6'}, 700);
        $('#Cal,#weekday').animate({opacity:'0.8'}, 700);
    }

    setTimeout(notif, 1000);
};

notif();
