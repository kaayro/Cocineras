var serverFile='http://192.168.1.64/carlos/APPS/mitierraoaxaca/Web/fnc/ajaxfnc2.php';
$(function(){
    cargarTlayudas();
    //Tlayudas Preparadas
    $(document).hammer().on("tap",'.preparada',function(){
        var p=$(this).parent().attr('tlayuda');
        preparada(p,$(this));
    });
    //Tlayudas Listas
    $(document).hammer().on("tap",'.lista',function(){
        isReady=$(this).parent().children('.preparada').size();
        alert(isReady);
        if(isReady>0){
            var p=$(this).parent().attr('tlayuda');
            calentada(p,$(this));
        }
    });
});

function cargarTlayudas(){
    //Obtener Tlayudas Listadas
    syncTlayudas();
}

function syncTlayudas(){
    $.ajax({
        type: "POST",
        url: serverFile,
        data: "fnc=getSyncTlayudas"
    }).done(function(tlay){
        tlay = JSON.parse(tlay);
        //alert(tlay);
        for(i=0;i<tlay.length;i++){
            exists=false;
            $('#home ul li').each(function(e){
            if($(this).attr('tlayuda')==tlay[i].tlaId)
                exists=true;
            });
            if(!exists)
                $('#home ul').append('<li tlayuda="'+tlay[i].tlaId+'"><button class="preparada">Listo</button>'+tlay[i].producto+'<button class="lista">Listo</button></li>');
        }
    });
}

function preparada(tid,obj){
    alert();
    $.ajax({
        type: "POST",
        url: serverFile,
        data: "fnc=setTlayudaPreparada&tid="+tid
    }).done(function(done){
        if(done==1){
            obj.addClass('ready').removeClass('preparada');
        }
    });
}

function calentada(tid,obj){
    $.ajax({
        type: "POST",
        url: serverFile,
        data: "fnc=setTlayudaCalentada&tid="+tid
    }).done(function(done){
        if(done==1){
            obj.parent('li').remove();
        }
    });
}