var serverFile='http://192.168.1.69/carlos/APPS/mitierraoaxaca/Web/fnc/ajaxfnc2.php';
$(function(){
    document.addEventListener("deviceready",function(){
        cargarTlayudas();
        listenerComentarios = setInterval(function(){comentarios();},1000);
        //Tlayudas Preparadas
        $(document).hammer().on("tap",'.preparada',function(){
            var p=$(this).parents('li').attr('tlayuda');
            preparada(p,$(this));
        });
        //Tlayudas Listas
        $(document).hammer().on("tap",'.lista',function(){
            isReady=$(this).parents('li').find('.ready').length;
            if(isReady>0){
                var p=$(this).parents('li').attr('tlayuda');
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
        //eliminar inexistentes
        $('#home ul li').each(function(e){
            exists=false;
            for(i=0;i<tlay.length;i++){
                if($(this).attr('tlayuda')==tlay[i].tlaId){
                    exists=true;
                }
            }
            if(!exists)
                $(this).remove();
        });
        //agregar nuevos
        for(i=0;i<tlay.length;i++){
            exists=false;
            obj=null;
            $('#home ul li').each(function(e){
                if($(this).attr('tlayuda')==tlay[i].tlaId){
                    exists=true;
                }
            });
            if(!exists){
				mesa='';
				if(tlay[i].tipoMesa==1){mesa=tlay[i].nombre;}else{mesa='Mesa '+tlay[i].mesaId;}
                $('#home ul').append('<li tlayuda="'+tlay[i].tlaId+'"><table style="width=100%;"><tr><td rowspan="2"><button class="preparada">Listo</button></td><td>'+tlay[i].producto+'</td><td>'+mesa+'</td><td rowspan="2"><button class="lista">Listo</button></td> </tr><tr><td></td><td class="comments"></td><td></td></tr></table></li>');
			}
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
			//alert(done);
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
            obj.parents('li').remove();
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
            for(i=0;i<done.length;i++){
                var text = '';
                for(j=0;j<done[i].length;j++){
                    text += done[i][j].tipo+' '+done[i][j].cantidad+' '+done[i][j].ingrediente+', ';
                }
                $('li[tlayuda='+done[i][0].tlaId+'] td.comments').html('').append(text);
            }
            $('li[tlayuda='+done[i][j].tlaId+'] td.comments').html('').append(text);
        });
    }
}