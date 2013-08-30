var serverFile='http://192.168.1.69/carlos/APPS/mitierraoaxaca/Web/fnc/ajaxfnc2.php';
$(function(){
    document.addEventListener("deviceready",function(){
        cargarTlayudas();
        listenerComentarios = setInterval(function(){comentarios();},500);
        //Tlayudas Preparadas
        $(document).hammer().on("tap",'.preparada',function(){
            var p=$(this).parent().attr('tlayuda');
            preparada(p,$(this));
        });
        //Tlayudas Listas
        $(document).hammer().on("tap",'.lista',function(){
            isReady=$(this).parent().children('.ready').size();
            if(isReady>0){
                var p=$(this).parent().attr('tlayuda');
                calentada(p,$(this));
            }
        });
    },false);
});

function cargarTlayudas(){
    //Obtener Tlayudas Listadas
    listenarTlay = setInterval(function(){syncTlayudas();},5000);
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
                $('#home ul').append('<li tlayuda="'+tlay[i].tlaId+'"><button class="preparada">Listo</button>'+tlay[i].producto+'<button class="lista">Listo</button><span class="comments"></span></li>');
        }
    });
}

function preparada(tid,obj){
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

function comentarios(){
    var tlays = '';
    $('#home ul li').each(function(i){
        if(i==0)
            tlays += $(this).attr('tlayuda');
        else
            tlays += ','+$(this).attr('tlayuda');
    });
    if(tlays!=''){
        $.ajax({
            type: "POST",
            url: serverFile,
            data: "fnc=getTlayudaComents&tlays="+tlays
        }).done(function(done){
            done = JSON.parse(done);
            alert(done);
            for(i=0;i<done.length;i++){
                $('li[tlayuda='+done[i][0].tlaId+'] span.comments').html('').append(done[i][0].tipo+' '+done[i][0].cantidad+' '+done[i][0].ingrediente);
            }
        });
    }
}