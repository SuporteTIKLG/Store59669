/* Grid [06/2023] v7 */

var FCGrid$ = function(){
  "use strict";
  var product={},myOptions={},aProductList,aProductOnlyOne,aProductListAll=[],aProductOnlyOneAll=[],aDescriptorsPrevious=[],aSettingsAll=[],iGridQtd=0,iGridAtual=0,iGridAnterior=0;

  /* Get Youtube Code */
  var saveCodVideoGrid;
  function showVideoGrid(sVideoCod){
    saveCodVideoGrid = sVideoCod;
  };
  
  /* Options internal function settings */
  var settings={
    descriptorsActive: null, /* Defines the descriptors in the products [product array, number of descriptors] */
    descriptorsPrevious: [], /* Stores descriptors for clicked products */
    pathColorsImg: FC$.PathPrd +"cores/",
    idElementGrid: null
  };

  /* Options */
  var options={
    autoSelect: false,
    cartOnPage: true,
    shippingUpdate: false,
    incMultGrid: false,
    separadorRGBCor: '|',
    qtyDescriptors: 2,
    htmlFlagChecked: '<i class="FCCheckedGrid"></i>',
    imageProduct: 'cor',
    colorName: false,
    colorImg: false,
    btnAnimation: true,
    colorImgFormat: '.gif',
    stock: false,
    btnSelectImg: rk('grid-choose-options-above-button'),
    btnBuyImg: rk('grid-add-to-cart-button'),
    btnAddedImg: rk('grid-ready-button'),
    btnContactUSImg: rk('grid-contact-us-button'),
    btnSoldOut: rk('grid-sold-out-button'),
    btnVideo: 'icon-grid-play.svg?cccfc=1',
    textGrid:rk('grid-text-select-options-below'),
    order: ['cor','adicional1','adicional2','adicional3','adicionalD1','adicionalD2','adicionalD3'],
    nameDescriptor:{
      cor: 'Cor',
      adicional1: 'Descriptor 1',
      adicional2: 'Descriptor 2',
      adicional3: 'Descriptor 3',
      adicionalD1: 'Descriptor 4',
      adicionalD2: 'Descriptor 5',
      adicionalD3: 'Descriptor 6'
    },
    textDescriptor:{
      cor: rk('grid-select-text'),
      adicional1: rk('grid-select-text'),
      adicional2: rk('grid-select-text'),
      adicional3: rk('grid-select-text'),
      adicionalD1: rk('grid-select-text'),
      adicionalD2: rk('grid-select-text'),
      adicionalD3: rk('grid-select-text')
    }
  };

  /* Fn auxiliares Grid_FC:begin */
  var fn={
    eliminateDuplicates: function(arr){
      var i,len=arr.length,out=[],obj={};for(i=0;i<len;i++){obj[arr[i]]=0;}for(i in obj){out.push(i);} return out;
    },

    /* returns [] the value of a given descriptor, eg. size [ 'P', 'M', 'G' ] */
    getDescriptorValueProducts: function(obj, value){
      var results=[];
      for(var i=0; i< obj.length; i++){var prd = JSON.parse(obj[i]);results.push(prd[value]);}
      return results;
    },

    removeClass: function(elementHTML, classNameRemove){
      var rxp = new RegExp( "\\s?\\b"+classNameRemove+"\\b", "g" );
      if(typeof elementHTML.length != 'undefined' &&  typeof elementHTML.item != 'undefined' && typeof elementHTML === 'object'){
        for(var i=0; i<elementHTML.length; i++){
          var objClass=elementHTML[i];
          objClass.className = objClass.className.replace(rxp,'');
        }
      }else if(elementHTML && typeof elementHTML.length == 'undefined'){
        elementHTML.className = elementHTML.className.replace(rxp,'');
      }
    },

    addClass: function(elementHTML,classNameAdd){
      elementHTML.className += " " + classNameAdd.replace(/^\s+|\s+$/g,"");
    },

    hasClass: function(elementHTML, classNameHas){
      var has = true, names = String(classNameHas).replace(/^\s+|\s+$/g, '').split(/\s+/);
      for(var i = 0, len = names.length; i < len; i++){
        if(!(elementHTML.className.search(new RegExp('(?:\\s+|^)' + names[i] + '(?:\\s+|$)', 'i')) > -1)){
          has = false;
          break;
        }
      }
      return has;
    },

    getColor: function(a){
      var name = a.slice(0,a.indexOf( options.separadorRGBCor )), rgb = a.slice(a.indexOf( options.separadorRGBCor )+1, a.length);
      return{
        name:name,
        rgb:rgb
      };
    },

    /* check if the descriptor is available */
    productAvailableFlag: function(oProd, iNivelAtual){
      var sFlag = {'htmlLabel': '', 'classLabel': ''};
      if(oProd!==null){
        var bNivelAtualDisp = parseInt(iNivelAtual)+1 == (settings.descriptorsActive.length-1) ? true : false; /* Get the last level */
        if(oProd.length==1 || bNivelAtualDisp){
          var oProdParse = oProd, fPriceDisp = parseFloat(oProdParse.priceNum), iEstoqueDisp = parseInt(oProdParse.estoque), sContentText="";
          if(iEstoqueDisp===0){ sContentText="x"; }else{ if(iEstoqueDisp>0 && fPriceDisp===0){ sContentText="!";}}
          if(sContentText!==""){
            sFlag.htmlLabel="<b class=\"FCFlagEsgotadoGrid\">"+ sContentText +"</b>";
            sFlag.classLabel="FCSoldOutLabel";
          }
        }
      }
      return sFlag;
    },

    getImageProd: function(aProductList, descriptorImg, iNivelAtual){
      for(var i=0; i< aProductList.length; i++){
        var oProd = JSON.parse(aProductList[i]);
        if(oProd[settings.descriptorsActive[iNivelAtual]] == descriptorImg){
          return {'imgDet': oProd.imgDet , 'imgAmp': oProd.imgAmp};
        }
      }
    },

    /* Define existing descriptors */
    setActiveDescriptors: function(aPrdListDescr, qtyDescriptors){
      var results = [], idProdutoSemDescritor="";
      for(var i=0; i< qtyDescriptors; i++){
        var iCont=aPrdListDescr.length;
        for(var j=0; j < aPrdListDescr.length;j++){
          var oProd = JSON.parse(aPrdListDescr[j]), sDescritor=oProd[options.order[i]];
          if(sDescritor===undefined || sDescritor===""){ iCont--; idProdutoSemDescritor=oProd.IDProduto;} /* handle error when a product descriptor is missing */
        }
        if(iCont==aPrdListDescr.length){results.push(options.order[i]);}
        else if(iCont!==aPrdListDescr.length && iCont>0){
          fn.consoleLogFC({'FC_Log_Grid_v1' : 'product with missing descriptor', 'descriptor' : options.order[i] + ' ('+ options.nameDescriptor[options.order[i]] +')', 'IDProduto' : idProdutoSemDescritor });
          document.getElementById( settings.idElementGrid ).innerHTML="<span>"+ rk("grid-select-products-missing-descriptors") +"</span>";
          return false;
        }
      }
      return results;
    },

    setAttrProduct: function(arr){
      if(typeof arr === "object" && arr !== null){
        product.IDProduto=arr.IDProduto;
        product.IDProdutoPai=arr.IDProdutoPai;
        product.cor=arr.cor;
        product.codProd=arr.codProd;
        product.estoque=arr.estoque;
        product.peso=arr.peso;
        product.priceOri=arr.priceOri;
        product.priceNum=arr.priceNum;
        product.maxInstallmentsNum=arr.maxInstallmentsNum;
        product.name=arr.ProdName;
        product.category=arr.ProdCategory;
        product.adicional1=arr.adicional1;
        product.adicional2=arr.adicional2;
        product.adicional3=arr.adicional3;
        product.adicionalD1=arr.adicionalD1;
        product.adicionalD2=arr.adicionalD2;
        product.adicionalD3=arr.adicionalD3;
        product.imgDet=arr.imgDet;
        product.imgAmp=arr.imgAmp;
      }else{ fn.consoleLogFC({'FC_Log_Grid_v1' : 'Invalid subproduct json'}); }
    },

    magicZoomFC: function(id,novoArray,novoArrayAmp,FC_MaxImages,refreshZoom){

      var imgDetMini="", imgAmpMini="", sHtmlZoom="";
      var sNameProd = fn.getNameProduct();
      
      if(!sF$.fnGetConfig("Grid_thumbnails")){
        document.body.classList.add("detGridContainerDefault");

        /* Default grid zoom */  
        if(saveCodVideoGrid==""){
          for(var i=0;i<=FC_MaxImages;i++)
          {
            if(i===0)
            {
              imgDetMini=novoArray[i];
              imgAmpMini=novoArrayAmp[i];
              sHtmlZoom+="<div data-slide-id='zoom' class='zoom-gallery-slide active grid-container-deafult'><a href="+ imgAmpMini.replace(/\s/g,'') +" class='MagicZoom' id='zoom2' data-mobile-options='textExpandHint:"+ rk("prod-click-to-zoom-in-mobile") +";textClickZoomHint:"+ rk("prod-click-to-zoom-in-pinch") +";zoomMode:off' data-options='textHoverZoomHint:"+ rk("prod-click-to-zoom-in") +";textExpandHint:;selectorTrigger:hover;transitionEffect:false;lazyZoom:true'><img width='512' height='543' fetchpriority='high' src="+ imgDetMini.replace(/\s/g,'') +" alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\" onerror='MostraImgOnError(this,0)'></a></div>"
                        +"<div class='selectors position-thumbnails'><a href=\""+ imgAmpMini.replace(/\s/g,'') +"\" data-slide-id='zoom' data-zoom-id='zoom2' class='active' data-image=\""+ imgDetMini.replace(/\s/g,'') +"\"><img width='66' height='70' src=\""+ imgDetMini.replace(/\s/g,'') +"\" class=ZoomIMG2 alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\" onerror='MostraImgOnError(this,0)'></a>"
            }
            else{
              if(novoArray[i].indexOf('#')>=0){
                imgDetMini=novoArray[i].replace('#',FC$.PathPrdExt);
                imgAmpMini=novoArrayAmp[i].replace('#',FC$.PathPrdExt);
              }else{
                imgDetMini=FC$.PathPrd+novoArray[i];
                imgAmpMini=FC$.PathPrd+novoArrayAmp[i];
              }
              sHtmlZoom+="<div class='selectors'><a href="+ imgAmpMini.replace(/\s/g,'') +" data-slide-id='zoom' data-zoom-id='zoom2' class='active' data-image="+ imgDetMini.replace(/\s/g,'') +"><img width='66' height='70' src="+ imgDetMini.replace(/\s/g,'') +" class=ZoomIMG2 alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\" onerror='MostraImgOnError(this,0)'></a></div>";
            }
          }
        }else{  
          for(var i=0;i<=FC_MaxImages;i++)
          {
            if(i===0)
            {
              imgDetMini=novoArray[i];
              imgAmpMini=novoArrayAmp[i];
                sHtmlZoom+="<div data-slide-id='zoom' class='zoom-gallery-slide active'><a href="+ imgAmpMini.replace(/\s/g,'') +" class='MagicZoom' id='zoom2' data-mobile-options='textExpandHint:"+ rk("prod-click-to-zoom-in-mobile") +";textClickZoomHint:"+ rk("prod-click-to-zoom-in-pinch") +";zoomMode:off' data-options='textHoverZoomHint:"+ rk("prod-click-to-zoom-in") +";textExpandHint:;selectorTrigger:hover;transitionEffect:false;lazyZoom:true;'><img width='512' height='543' src="+ imgDetMini.replace(/\s/g,'') +" alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\" onerror='MostraImgOnError(this,0)'></a></div>"
                          +"<div data-slide-id='video-1' class='zoom-gallery-slide video-slide' id='get-video-display'><iframe width='560' height='315' id='gridYoutubeVideo' src='https://www.youtube.com/embed/"+ saveCodVideoGrid +"' frameborder='0' allowfullscreen loading='lazy'></iframe></div>"
                          +"<div class='selectors position-selectors'><div class='position-thumbnails2'><a href=\""+ imgAmpMini.replace(/\s/g,'') +"\" data-slide-id='zoom' data-zoom-id='zoom2' class='active' data-image=\""+ imgDetMini.replace(/\s/g,'') +"\"><img width='66' height='70' src=\""+ imgDetMini.replace(/\s/g,'') +"\" class=ZoomIMG2 alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\" onerror='MostraImgOnError(this,0)'></a></div>"
                          +"<div id='position-thumbnails'></div><a data-slide-id='video-1' href='#' id='videoGridLink'><img src=\""+ FC$.PathImg + options.btnVideo +"\" width='65' height='65' alt='Video Player' class='grid-video-player'></a></div>" ;
            }
            else{  
              if(novoArray[i].indexOf('#')>=0){
                imgDetMini=novoArray[i].replace('#',FC$.PathPrdExt);
                imgAmpMini=novoArrayAmp[i].replace('#',FC$.PathPrdExt);
              }else{
                imgDetMini=FC$.PathPrd+novoArray[i];
                imgAmpMini=FC$.PathPrd+novoArrayAmp[i];
              }
              sHtmlZoom+="<div class='selectors'><span class='multiple-thumbnails'><a href="+ imgAmpMini.replace(/\s/g,'') +" data-slide-id='zoom' data-zoom-id='zoom2' class='active what' data-image="+ imgDetMini.replace(/\s/g,'') +"><img width='66' height='70' src="+ imgDetMini.replace(/\s/g,'') +" class=ZoomIMG2 alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\" onerror='MostraImgOnError(this,0)'></a></span></div>";
            }
          }
        }
      }else{
        document.body.classList.add("detGridContainerThumb");
        /* New grid zoom */      
        if(saveCodVideoGrid==""){
          for(var i=0;i<=FC_MaxImages;i++)
          {
            if(i===0)
            {
              imgDetMini=novoArray[i];
              imgAmpMini=novoArrayAmp[i];
              sHtmlZoom+="<div data-slide-id='zoom' class='zoom-gallery-slide active'><a href="+ imgAmpMini.replace(/\s/g,'') +" class='MagicZoom' id='zoom2' data-mobile-options='textExpandHint:"+ rk("prod-click-to-zoom-in-mobile") +";textClickZoomHint:"+ rk("prod-click-to-zoom-in-pinch") +";zoomMode:off' data-options='textHoverZoomHint:"+ rk("prod-click-to-zoom-in") +";textExpandHint:;selectorTrigger:hover;transitionEffect:false;lazyZoom:true'><img width='512' height='543' fetchpriority='high' src="+ imgDetMini.replace(/\s/g,'') +" alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\" onerror='MostraImgOnError(this,0)'></a></div>"
                       +"<div class='selectors position-thumbnails'><a href=\""+ imgAmpMini.replace(/\s/g,'') +"\"  data-options='zoomPosition:inner;hint:off' id='zoom2' data-mobile-options='zoomMode:off;hint:off;textExpandHint:"+ rk("prod-click-to-zoom-in-mobile") +";textClickZoomHint:"+ rk("prod-click-to-zoom-in-pinch") +";' class='MagicZoom' data-image=\""+ imgDetMini.replace(/\s/g,'') +"\"><img width='512' height='543' src=\""+ imgDetMini.replace(/\s/g,'') +"\" class='ZoomIMG2 image1' alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\" alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\" onerror='MostraImgOnError(this,0)'></a>"
            }
            else{
              if(novoArray[i].indexOf('#')>=0){
                imgDetMini=novoArray[i].replace('#',FC$.PathPrdExt);
                imgAmpMini=novoArrayAmp[i].replace('#',FC$.PathPrdExt);
              }else{
                imgDetMini=FC$.PathPrd+novoArray[i];
                imgAmpMini=FC$.PathPrd+novoArrayAmp[i];
              }
              sHtmlZoom+="<div class='selectors'><a href="+ imgAmpMini.replace(/\s/g,'') +" data-options='zoomPosition:inner;hint:off' class='MagicZoom' id='zoom2' data-mobile-options='zoomMode:off;hint:off;textExpandHint:"+ rk("prod-click-to-zoom-in-mobile") +";textClickZoomHint:"+ rk("prod-click-to-zoom-in-pinch") +";' data-image="+ imgDetMini.replace(/\s/g,'') +"><img width='512' height='543' src="+ imgDetMini.replace(/\s/g,'') +" class='ZoomIMG2 image2' alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\" alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\" onerror='MostraImgOnError(this,0)'></a></div>";
            }
          }
        }else{  
          for(var i=0;i<=FC_MaxImages;i++)
          {
            if(i===0)
            {
              imgDetMini=novoArray[i];
              imgAmpMini=novoArrayAmp[i];
              if(window.matchMedia("(min-width:1025px)").matches){
                sHtmlZoom+="<div data-slide-id='zoom' class='zoom-gallery-slide active'><a href="+ imgAmpMini.replace(/\s/g,'') +" class='MagicZoom' id='zoom2' data-mobile-options='textExpandHint:"+ rk("prod-click-to-zoom-in-mobile") +";textClickZoomHint:"+ rk("prod-click-to-zoom-in-pinch") +";zoomMode:off' data-options='textHoverZoomHint:"+ rk("prod-click-to-zoom-in") +";textExpandHint:;selectorTrigger:hover;transitionEffect:false;lazyZoom:true;expand:off'><img width='512' height='543' src="+ imgDetMini.replace(/\s/g,'') +" alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\"  onerror='MostraImgOnError(this,0)'></a></div>"
                         +"<div data-slide-id='video-2' class='zoom-gallery-slide video-slide video-slide-mobile' id='get-video-display'><iframe width='560' height='315' id='gridYoutubeVideo' src='https://www.youtube.com/embed/"+ saveCodVideoGrid +"' frameborder='0' allowfullscreen loading='lazy'></iframe></div>"                       
                         +"<div class='selectors position-selectors grid-container-area-1'><div class='position-thumbnails2'><div class='zoom-gallery-slide video-slide video-thumb-grid' id='get-video-display' class='MagicZoom' id='zoom2'><iframe width='560' height='315' id='gridYoutubeVideo' src='https://www.youtube.com/embed/"+ saveCodVideoGrid +"' frameborder='0' allowfullscreen loading='lazy'></iframe></div> <a href=\""+ imgAmpMini.replace(/\s/g,'') +"\" id='zoom2' data-options='zoomPosition:inner;hint:off' class='MagicZoom' data-image=\""+ imgDetMini.replace(/\s/g,'') +"\"><img width='66' height='70' src=\""+ imgDetMini.replace(/\s/g,'') +"\" data-options='zoomPosition:inner;hint:off;expand:off' class='ZoomIMG2' alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\" onerror='MostraImgOnError(this,0)'></a> </div>"
                         +"<div id='position-thumbnails'></div><a data-slide-id='video-2' href='#' id='videoGridLink'><img src=\""+ FC$.PathImg + options.btnVideo +"\" width='65' height='65' alt='Video Player' class='grid-video-player'></a></div>" ;
              }else{
                sHtmlZoom+="<div data-slide-id='zoom' class='zoom-gallery-slide active'><a href="+ imgAmpMini.replace(/\s/g,'') +" class='MagicZoom' id='zoom2' data-mobile-options='textExpandHint:"+ rk("prod-click-to-zoom-in-mobile") +";textClickZoomHint:"+ rk("prod-click-to-zoom-in-pinch") +";zoomMode:off' data-options='textHoverZoomHint:"+ rk("prod-click-to-zoom-in") +";textExpandHint:;selectorTrigger:hover;transitionEffect:false;lazyZoom:true;'><img width='512' height='543' src="+ imgDetMini.replace(/\s/g,'') +" alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\" onerror='MostraImgOnError(this,0)'></a></div>"
                         +"<div data-slide-id='video-1' class='zoom-gallery-slide video-slide' id='get-video-display'><iframe width='560' height='315' id='gridYoutubeVideo' src='https://www.youtube.com/embed/"+ saveCodVideoGrid +"' frameborder='0' allowfullscreen loading='lazy'></iframe></div>"
                         +"<div class='selectors position-selectors'><div class='position-thumbnails2'><a href=\""+ imgAmpMini.replace(/\s/g,'') +"\" class='active MagicZoom' data-options='zoomPosition:inner;hint:off' data-image=\""+ imgDetMini.replace(/\s/g,'') +"\"><img width='66' height='70' src=\""+ imgDetMini.replace(/\s/g,'') +"\" class='ZoomIMG2 image2' alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\" data-options='zoomPosition:inner;hint:off;expand:off' onerror='MostraImgOnError(this,0)'></a></div>"
                         +"<div id='position-thumbnails'></div><a data-slide-id='video-1' href='#' id='videoGridLink'><img src=\""+ FC$.PathImg + options.btnVideo +"\" width='65' height='65' alt='Video Player' class='grid-video-player'></a></div>" ;
              }
            }
            else{  
            
              if(novoArray[i].indexOf('#')>=0){
                imgDetMini=novoArray[i].replace('#',FC$.PathPrdExt);
                imgAmpMini=novoArrayAmp[i].replace('#',FC$.PathPrdExt);
              }else{
                imgDetMini=FC$.PathPrd+novoArray[i];
                imgAmpMini=FC$.PathPrd+novoArrayAmp[i];
              }
              if(window.matchMedia("(min-width:1025px)").matches){
                sHtmlZoom+="<div class='selectors grid-container-area-3'><span class='multiple-thumbnails'><a href="+ imgAmpMini.replace(/\s/g,'') +" data-options='zoomPosition:inner;hint:off' class='active MagicZoom' id='zoom2' data-image="+ imgDetMini.replace(/\s/g,'') +"><img width='66' height='70' src="+ imgDetMini.replace(/\s/g,'') +" class='ZoomIMG2' alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\"></a></span></div>";
              }else{
                sHtmlZoom+="<div class='selectors'><span class='multiple-thumbnails'><a href="+ imgAmpMini.replace(/\s/g,'') +" data-options='zoomPosition:inner;hint:off' class='MagicZoom' id='zoom2' data-mobile-options='zoomMode:off;hint:off' data-image="+ imgDetMini.replace(/\s/g,'') +"><img width='66' height='70' src="+ imgDetMini.replace(/\s/g,'') +" class='ZoomIMG2' alt=\""+ fn.getNameProduct().replace(/\"/g, '&quot;') +"\"></a></span></div>";      
              }
            }
          }
        }
      }
             
      document.getElementById(id).innerHTML=sHtmlZoom;
      sF$.fnGridVideoPosition();
      sF$.fnInsertVideoGridThumb();
      
      setTimeout(function(){      
        var mgZoomId = document.querySelector('#zoom2');
        mgZoomId.setAttribute('title',sNameProd);
        if(refreshZoom)MagicZoom.refresh();
      },700);
    },

    imgView: function(srcImgDet,srcImgAmp,refreshZoom){
      var imgDetAll = srcImgDet;
      var imgAmpAll = srcImgAmp;
      var novoArray = imgDetAll.split(',');
      var novoArrayAmp = imgAmpAll.split(',');
      var CountImgDet=novoArray.length;
      var CountImgAmp=novoArrayAmp.length;

      if (imgDetAll==="" || imgAmpAll===""){
        /* fn.consoleLogFC({'FC_Log_Grid_v1' : 'subproduct without image'}); */
        return "";
      }
      else{
        if(CountImgDet==CountImgAmp){var FC_MaxImages=CountImgDet-1;}else{var FC_MaxImages=0;}
        if(document.getElementById('idDivGridImg'))return this.magicZoomFC('idDivGridImg',novoArray,novoArrayAmp,FC_MaxImages,refreshZoom);
        else{
          if(iGridAtual>0 && novoArray[0]){
            var IDProdutoPai=JSON.parse(aProductListAll[iGridAtual-1][0]).IDProdutoPai;
            var oImgPai=document.querySelector("#id-video-image"+ IDProdutoPai +" img");
            if(oImgPai)oImgPai.src=novoArray[0];
          }
        }
      }
    },

    isSingleDescriptor: function(){
      if(settings.descriptorsActive.length==1){return true;}else{return false;}
    },

    marge: function(obj1,obj2){
      var result={}, name; for(name in obj1) result[name]=obj1[name]; for(name in obj2) result[name]=obj2[name]; return result;
    },

    popupSoldOutProduct: function(params){
      return new window.top.MostraDispCaptcha(FC$.IDLoja, product.IDProduto); /* Function for availability warning popup, product sold out */
    },

    qtyIncFieldDisabled: function(isDisabled, isValueField){
      if(isDisabled){ document.getElementById("idQTIncMultGrid").disabled=true; }else{ document.getElementById("idQTIncMultGrid").disabled=false;}
      if(isValueField){
        if(document.getElementById("idQTIncMultGrid").value===0) document.getElementById("idQTIncMultGrid").value=1;
        var oQtdZip = document.querySelector("[id^='idQtdZip']");
        if(oQtdZip && oQtdZip==0)oQtdZip.value=1;
      }
    },

    consultUsAboutProduct: function(){
      var IDSubProd=product.IDProduto;
      var aNameRGB=product.cor.split(options.separadorRGBCor);
      var sNameColor=aNameRGB[0];
      var sCodeRef=product.codProd;
      if(sCodeRef!=="")sCodeRef="Cod%2E%20refer%EAncia%20"+sCodeRef;

      var sURLConsultUsAbout=FCLib$.uk("url-contact")+'?Assunto=Consulta%20sobre%20o%20produto%20'+ fn.getNameProduct() +'%20(ID%20'+ IDSubProd +')%20'+ sCodeRef +'%20%2C';
      if(sNameColor!=='')sURLConsultUsAbout+=' '+ options.nameDescriptor['cor'] +' '+ sNameColor.replace(/\+/g,'%2B') +'%2C';
      if(product.adicional1!=='')sURLConsultUsAbout+=' '+ options.nameDescriptor['adicional1'] +' '+ fn.encodeURI( fn.charCode(product.adicional1) ) +'%2C';
      if(product.adicional2!=='')sURLConsultUsAbout+=' '+ options.nameDescriptor['adicional2'] +' '+ fn.encodeURI( fn.charCode(product.adicional2) ) +'%2C';
      if(product.adicional3!=='')sURLConsultUsAbout+=' '+ options.nameDescriptor['adicional3'] +' '+ fn.encodeURI( fn.charCode(product.adicional3) ) +'%2C';
      if(product.adicionalD1!=='')sURLConsultUsAbout+=' '+ options.nameDescriptor['adicionalD1'] +' '+ fn.encodeURI( fn.charCode(product.adicionalD1) ) +'%2C';
      if(product.adicionalD2!=='')sURLConsultUsAbout+=' '+ options.nameDescriptor['adicionalD2'] +' '+ fn.encodeURI( fn.charCode(product.adicionalD2) ) +'%2C';
      if(product.adicionalD3!=='')sURLConsultUsAbout+=' '+ options.nameDescriptor['adicionalD3'] +' '+ fn.encodeURI( fn.charCode(product.adicionalD3) ) +'%2C';
      top.location.href=sURLConsultUsAbout;
    },

    setPriceProduct: function(product){
      var oPositionPrice=document.getElementById("idPriceGridFC"+ product.IDProdutoPai);

      if(parseFloat(product.priceNum) > 0 && oPositionPrice){
        var oMaxInstallments = fnMaxInstallmentsGrid(product.priceNum, product.maxInstallmentsNum);
        var oEconomyJS = (typeof fnShowEconomyGrid == 'function') ?  fnShowEconomyGrid(product.priceNum, product.priceOri) : "";

        var oPositionTableDiscount = document.getElementById("idPriceAVista"+ product.IDProduto);
        if (iPaymentDiscount && oPositionTableDiscount) { /* checks if there is a cash discount and its table to present it */
          if (product.priceNum > 0 || iPaymentDiscount > 0) {
            oPositionTableDiscount.innerHTML = "<div class='PriceAVistaProdLista'><p>"+ rk("grid-select-payments-win") +" <b>" + iPaymentDiscount + ""+ rk("grid-select-payments-win-discount") +"</b>.</p><p>"+ rk("grid-select-payments-win-discount-value") +" <b>"+ FormatPrice(product.priceNum * ((100 - iPaymentDiscount) / 100), FC$.Currency) +"</b></p></div>";
          }
        }

        sF$.fnMostraDescontoProdDet(product.priceNum);
        if(product.priceNum!=product.priceOri){

           return oPositionPrice.innerHTML="<span class=oldPrice style=\"text-decoration: line-through;\">"+ FCLib$.FormatPreco(FCLib$.formatMoney(product.priceOri,FC$.Currency)) +"</span> <b>"+ FCLib$.FormatPreco(FCLib$.formatMoney(product.priceNum,FC$.Currency)) +"</b> " + oMaxInstallments + oEconomyJS;
         }
         else{
           return oPositionPrice.innerHTML="<b>"+ FCLib$.FormatPreco(FCLib$.formatMoney(product.priceNum,FC$.Currency)) +"</b> "+ oMaxInstallments;
         }
      }else{
        document.getElementById("idPriceAVista").innerHTML="";
        return oPositionPrice.innerHTML=rk("grid-select-price-on-request");
       }
    },

    setCodeProduct: function(){
      var oPositionCode=document.getElementById("idCodProdGrid");
      if(oPositionCode && product.codProd !== "") oPositionCode.innerHTML=product.codProd;
    },

    availableBuyProduct: function(product, sParamsGrid){
      var oBtnComprar=document.createElement("div");
      oBtnComprar.setAttribute("data-grid",iGridQtd);
      if(!product){
        oBtnComprar.setAttribute("class", "FCBtnGrid FCBtnSelectedOption FCBtnSelecioneGrid FCBtnSelecioneGridPosition");
        oBtnComprar.innerHTML="<div class=\"fc-grid-choose-options-button\"><b>"+ options.btnSelectImg +"</b></div>"
                             +"<div class=\"FCTooltipGrid Off\" id=idTooltipGridFC"+ iGridQtd +" style=\"display:\">"+ rk("grid-select-product-first") +"</div>";
        oBtnComprar.onclick=function(a){
          iGridAtual=this.getAttribute("data-grid");
          if(document.getElementById("idTooltipGridFC"+ iGridAtual)){
            if( fn.hasClass(document.getElementById("idTooltipGridFC"+ iGridAtual), "Off")){
              fn.removeClass(document.getElementById("idTooltipGridFC"+ iGridAtual), "Off");
              fn.addClass(document.getElementById("idTooltipGridFC"+ iGridAtual), "On");
            }else{
              fn.removeClass(document.getElementById("idTooltipGridFC"+ iGridAtual), "On");
              fn.addClass(document.getElementById("idTooltipGridFC"+ iGridAtual), "Off");
            }
            var oTooltip=document.getElementById("idTooltipGridFC"+ iGridAtual).style.display;
          }
          else if(window.top.document.getElementById("idTooltipGridFC"+ iGridAtual)){
            if( fn.hasClass(window.top.document.getElementById("idTooltipGridFC"+ iGridAtual), "Off")){
              fn.removeClass(window.top.document.getElementById("idTooltipGridFC"+ iGridAtual), "Off");
              fn.addClass(window.top.document.getElementById("idTooltipGridFC"+ iGridAtual), "On");
            }else{
              fn.removeClass(window.top.document.getElementById("idTooltipGridFC"+ iGridAtual), "On");
              fn.addClass(window.top.document.getElementById("idTooltipGridFC"+ iGridAtual), "Off");
            }
            var oTooltip=window.top.document.getElementById("idTooltipGridFC"+ iGridAtual).style.display;
          }
        };
      }
      else{
        if(parseInt(product.estoque)<=0){
          oBtnComprar.setAttribute("class", "FCBtnGrid FCBtnEsgotadoGrid");
          oBtnComprar.innerHTML="<div class=\"fc-grid-sold-out-button\"><b>"+ options.btnSoldOut +"</b></div>";
          oBtnComprar.onclick=function(){
            fn.popupSoldOutProduct(sParamsGrid);
          };
          if(options.incMultGrid)fn.qtyIncFieldDisabled(true, false);
          fn.getShippingView(false); /* shipping simulation */
        }
        else if(parseInt(product.estoque)>0 && parseFloat(product.priceNum) === 0){
          oBtnComprar.setAttribute("class", "FCBtnGrid FCBtnConsultenos");
          oBtnComprar.innerHTML="<div class=\"fc-grid-contact-us-button\">"+ options.btnContactUSImg +"</div>";
          oBtnComprar.onclick=function(){
            fn.consultUsAboutProduct(sParamsGrid);
          };
          if(options.incMultGrid)fn.qtyIncFieldDisabled(true, false);
          fn.getShippingView(false); /* shipping simulation */
        }
        else{
          fnShowCEPGrid(product.IDProdutoPai,product.IDProduto);
          oBtnComprar.setAttribute("class", "FCBtnGrid FCBtnComprarGrid");
          oBtnComprar.setAttribute("id","cartBtnImg_"+ iGridQtd)
          oBtnComprar.innerHTML="<div class=\"fc-grid-add-to-cart-button\"><b>"+ options.btnBuyImg +"</b></div>";
          oBtnComprar.onclick=function(obj){
            fnBuyProduct(this);
          };
          fn.getShippingView(true);
          if(options.incMultGrid)fn.qtyIncFieldDisabled(false, true);
        }
      }
      return oBtnComprar;
    },

    srcProduct: function(nivelAtual,descriptorImg,aProductList){
      var iNivelAtual=parseInt(nivelAtual);
      var aDataImagem=fn.getImageProd(aProductList, descriptorImg, iNivelAtual);
      return " data-img-det=\""+ aDataImagem.imgDet +"\" data-img-amp=\""+ aDataImagem.imgAmp +"\"";
    },

    viewStock: function(iEstoqueDetail,fPriceDetails){
        var sEstoqueDetailOut="";
        if(iEstoqueDetail === 0){sEstoqueDetailOut= rk("grid-unavailable");}
        else if(fPriceDetails === 0){sEstoqueDetailOut= rk("grid-on-request")}
        else{sEstoqueDetailOut=iEstoqueDetail}
        return "<span class=\"AdicNome\">"+ rk("grid-quantity-stock") +":</span> <span class=\"AdicItem\"><b>"+ sEstoqueDetailOut +"</b></span>";
    },

    getDetailsProduct: function(){
      var sHtmlDetails = "";
      for(var i=0; i<settings.descriptorsActive.length; i++){
        var str = settings.descriptorsActive[i];
        if(str.toUpperCase() == 'COR'){
          var aNameRGB=product[settings.descriptorsActive[i]];
          var sNameColor=aNameRGB.split(options.separadorRGBCor);
          var sNomeAdic=sNameColor[0];
        }
        else{
          var sNomeAdic = product[settings.descriptorsActive[i]];
        }
        sHtmlDetails+= "<div class=\"FCGridAdicContent FCGridAdicProductList\"><span class=\"AdicNome\">"+ options.nameDescriptor[settings.descriptorsActive[i]] +":</span><span class=\"AdicItem\">"+ sNomeAdic +"</span></div>";
      }
      /* quantity in stock */
      if(options.stock){
        var iEstoqueDetail = parseInt(product.estoque), fPriceDetails = parseFloat(product.priceNum);
        sHtmlDetails+= "<div class=\"FCGridAdicContent FCGridAdicProductList\">"+ fn.viewStock(iEstoqueDetail, fPriceDetails) +"</div>";
      }
      return sHtmlDetails;
    },

    classDescriptor: function(obj){
      return "FC"+ obj.charAt(0).toUpperCase() + obj.slice(1) +"Grid"; /* format the class for each descriptor */
    },

    charCode: function(obj){
      return obj.replace(/&amp;/g, '&#38;').replace(/&lt;/g, '&#60;').replace(/&gt;/g, '&#62;').replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(n); }); /*& < >*/
    },

    sendPost: function(url,oParams){
      var oForm=document.createElement("form");
      oForm.action=url;
      oForm.method="Post";
      oForm.name="FormMult";

      for(var i=0; i< oParams.length; i++) {
        var oInput=document.createElement("input");
        oInput.type="hidden";
        oInput.name=oParams[i][0];
        oInput.setAttribute("value", oParams[i][1]);
        oForm.appendChild(oInput);
      }
      document.body.appendChild(oForm);
      oForm.submit();
    },

    getNameProduct: function(){
      var oNameProd=document.getElementById('idNameProductGridFC');
      return oNameProd ? oNameProd.innerHTML : "";
    },

    getShippingView: function(isView){

      if(options.shippingUpdate){
        var oButtonShipping = document.getElementById("idCEPButton");
        var oZipField = document.querySelector("[id^='idZip']");
        var oQtdZipField = document.querySelector("[id^='idQtdZip']");
        var oShippingValues = document.querySelector("[id^='idShippingValues']");

        if(oZipField && oShippingValues){
          if(isView){
            oZipField.disabled = false;
            oQtdZipField.disabled = false;
            var iPesoProdSub = product.peso;
            iPesoProdSub = parseFloat(iPesoProdSub.replace(",","."));
            /* if the by-product has a weight of 0, the weight of the parent product is used for the shipping simulation */
            if(product.estoque !== "" && iPesoProdSub > 0 || product.estoque !== undefined && iPesoProdSub > 0){
              oZipField.id = "idZip"+ product.IDProduto;
              oQtdZipField.id = "idQtdZip"+ product.IDProduto;
              oShippingValues.id = "idShippingValues"+ product.IDProduto;
              oButtonShipping.onclick = function() {
                fnGetShippingValuesProdGrid(product.IDProduto);
                fn.consoleLogFC({'FC_Log_Grid_v1' : 'shipping simulation for the ID product '+ product.IDProduto});
              };
            }else{
              var oProdPai = JSON.parse(aProductOnlyOne);
              oZipField.id = "idZip"+ oProdPai.IDProduto;
              oQtdZipField.id = "idQtdZip"+ oProdPai.IDProduto;
              oShippingValues.id = "idShippingValues" + oProdPai.IDProduto;
              oButtonShipping.onclick = function() {
                fnGetShippingValuesProdGrid(oProdPai.IDProduto);
                fn.consoleLogFC({'FC_Log_Grid_v1' : 'shipping simulation for the ID product '+ oProdPai.IDProduto});
              };
            }
          }else{
            oButtonShipping.onclick = function() {
               alert(rk("grid-select-available-product"));
            };
            oZipField.disabled = true;
            oQtdZipField.disabled = true;
          }
        }
      }
    },

    creatInputIncMultQty: function(){
      var oInputIncMult = document.createElement("INPUT");
          oInputIncMult.setAttribute("type","text");
          oInputIncMult.setAttribute("value","1");
          oInputIncMult.setAttribute("size","1");
          oInputIncMult.setAttribute("maxlength","3");
          oInputIncMult.setAttribute("class","QTIncMultGrid");
          oInputIncMult.setAttribute("id","idQTIncMultGrid");
          oInputIncMult.setAttribute("name","QTIncMultGrid");
          oInputIncMult.disabled=true;
                    
      oInputIncMult.onkeyup=function(obj){fn.validQuantityIncMult(this);};
      var oSpan = document.createElement('span');
      oSpan.setAttribute('class','FCContentIncMultGrid');
      oSpan.appendChild(oInputIncMult);          
          
      /* button's plus and decrease */
      var oSpanButton = document.createElement("span");
      oSpanButton.setAttribute('class','FCIncMultGridButton');
      var oSpanButtonPlus = document.createElement('span');
      oSpanButtonPlus.innerHTML = '&#9650;';
      oSpanButtonPlus.onclick = function () {
        var elemQty = document.querySelector("#idQTIncMultGrid");
        if(elemQty && elemQty.disabled != true){
          var newValue = parseInt(elemQty.value) + (1);
          if(newValue > 0 && newValue < 1000){
            elemQty.value = newValue;
            fn.validQuantityIncMult(elemQty);
          }
        }
      };         

      var oSpanButtonDecrease = document.createElement('span');
      oSpanButtonDecrease.innerHTML = '&#9660;';
      oSpanButtonDecrease.onclick = function(){
        var elemQty = document.querySelector("#idQTIncMultGrid");
        if(elemQty && elemQty.disabled != true){
          var newValue = parseInt(elemQty.value) + (-1);
          if(newValue > 0 && newValue < 1000){
            elemQty.value = newValue;
            fn.validQuantityIncMult(elemQty);
          }
        }
      };
          
      oSpanButton.appendChild(oSpanButtonPlus);
      oSpanButton.appendChild(oSpanButtonDecrease);
      oSpan.appendChild(oSpanButton);
      return oSpan;   
          
      /* return oInputIncMult; */
    },

    validQuantityIncMult: function(objHTML){
      var sNumber = objHTML.value.replace(/[^0-9]/g, ""); /* removes everything other than 0-9 */
      sNumber = sNumber.replace(/^(0+)(\d)/g, "$2"); /* remove leading zeros */
      var oQtdZipFieldIncMult = document.querySelector("[id^='idQtdZip']");
      if(sNumber > 0){
        objHTML.value= sNumber.substring(0,3);
        if(oQtdZipFieldIncMult)oQtdZipFieldIncMult.value=sNumber.substring(0,3);
      }else{
        objHTML.value=0;
        if(oQtdZipFieldIncMult)oQtdZipFieldIncMult.value=0;
      }
    },

    convertCharAT: function(aProductsAT){
      var results=[];
      var aDescriptorsList = ["cor", "adicional1", "adicional2", "adicional3", "adicionalD1", "adicionalD2", "adicionalD3"];
      for(var i=0; i<aProductsAT.length; i++ ){
         var oProdAT = JSON.parse(aProductsAT[i]);
         for(var j=0; j<aDescriptorsList.length; j++){
           var sDescriptorAT = oProdAT[aDescriptorsList[j]];
           if( sDescriptorAT !== "") oProdAT[aDescriptorsList[j]] = fn.charCode(sDescriptorAT);
         }
      results.push(JSON.stringify(oProdAT));
      }
      return results;
    },

    encodeURI: function(obj){
      /* #$&+-_'.=?@" */
      var objReplace = obj.replace(/\&quot;/g,"\"");
      return escape(objReplace).replace(/\"/g,"%22").replace(/\#/g,"%23").replace(/\$/g,"%24").replace(/\&/g,"%26").replace(/\'/g,"%27").replace(/\+/g,"%2B").replace(/\-/g,"%2D").replace(/\./g,"%2E").replace(/\=/g,"%3D").replace(/\?/g,"%3F").replace(/\@/g,"%40").replace(/\_/g,"%5F");
    },

    consoleLogFC: function(obj){
      if (typeof console !== 'undefined')console.log(obj); /* Log product information */
    }

  };
  /* Fn helpers Grid_FC:end */

  /* Perform button press animation */
  function btnAnimation(posBtnComprar){
    if(options.btnAnimation){
      posBtnComprar.classList.add('btnFadeOut');
      posBtnComprar.innerHTML = "<div class=\"fc-grid-add-to-cart-ready-button\">"+ options.btnAddedImg +"</div>";
    }
  };

  function fnSelectsProducts(aProductList,sDescritorAtual,iNivelAtual){
    var results=[];
    var getProd = function (prd){
      if(settings.descriptorsPrevious[-2] !== undefined){
        for(var k=0; k<settings.descriptorsPrevious.length; k++){
          for(var l=0; l<options.order.length ;l++){
            if(prd[options.order[l]] === settings.descriptorsPrevious[k-1]){
              return true;
            }
          }
        }
        return false;
      }else{
        return true;
      }
    };

    for(var i=0; i<aProductList.length; i++){
      var prd = JSON.parse(aProductList[i]);
      if(settings.descriptorsPrevious[iNivelAtual-1] !== undefined){
        var iCont=0;
        var sDescriptorsActiveCharAT=fn.charCode( prd[settings.descriptorsActive[iNivelAtual]] );
        if( sDescriptorsActiveCharAT == sDescritorAtual){
          for(var j=0; j<settings.descriptorsPrevious.length;j++){
            var sDescriptorsActivePreviousCharAT = prd[settings.descriptorsActive[parseInt(iNivelAtual)-(1+j)]];
            if(sDescriptorsActivePreviousCharAT == settings.descriptorsPrevious[iNivelAtual-(1+j)]){
              if(getProd(prd))iCont++;
            }else{
              iCont=0; break;
            }
          }
          if(iCont>0) results.push(JSON.stringify(prd));
        }
      }else{
        if(prd[settings.descriptorsActive[iNivelAtual]] == sDescritorAtual)results.push(JSON.stringify(prd));
      }
    }
    return results;
  }

  function fnBuyProduct(posBtnComprar){
    var iQtyIncMult=1;
    var iGridClicado=posBtnComprar.parentNode.getAttribute("data-grid");  /* get iGrid from the parent of the clicked buy button, in product without sub */
    if(iGridClicado>0)fn.setAttrProduct(JSON.parse(aProductOnlyOneAll[iGridClicado-1]));
    /* incMult */
    if(options.incMultGrid){
      var iQtyEstoque=product.estoque;
      iQtyIncMult=document.getElementById("idQTIncMultGrid").value;
      if(iQtyIncMult>iQtyEstoque){
        alert(""+ rk("grid-stock-higher-available") +" \n"+ ""+ rk("grid-stock-available-now") +" ("+ iQtyEstoque +").");
        return document.getElementById("idQTIncMultGrid").focus();
      }
      if(iQtyIncMult==0){
        alert(rk("grid-quantity-requested-equal-greater"));
        return document.getElementById("idQTIncMultGrid").focus();
      }
    }

    /* all product parameters */
    var aNameRGB=product.cor.split(options.separadorRGBCor), sNameColor=aNameRGB[0];
    if(options.cartOnPage){
      var IDSubProd=product.IDProduto, sParamsProd='&QTIncMult_'+IDSubProd+'='+iQtyIncMult;
      if(sNameColor!=='')sParamsProd+='&'+(FCLib$.fnUseEHC()?"color":"cor")+'_'+ IDSubProd +'='+ EncodeParamFC(fn.charCode(sNameColor)).replace(/\+/g,'%2B');
      if(product.adicional1!=='')sParamsProd+='&'+ (FCLib$.fnUseEHC()?"a":"adicional") +'1_'+ IDSubProd +'='+ EncodeParamFC(fn.charCode(product.adicional1));
      if(product.adicional2!=='')sParamsProd+='&'+ (FCLib$.fnUseEHC()?"a":"adicional") +'2_'+ IDSubProd +'='+ EncodeParamFC(fn.charCode(product.adicional2));
      if(product.adicional3!=='')sParamsProd+='&'+ (FCLib$.fnUseEHC()?"a":"adicional") +'3_'+ IDSubProd +'='+ EncodeParamFC(fn.charCode(product.adicional3));
      if(product.adicionalD1!=='')sParamsProd+='&'+ (FCLib$.fnUseEHC()?"a":"adicional") +'d1_'+ IDSubProd +'='+ EncodeParamFC(fn.charCode(product.adicionalD1));
      if(product.adicionalD2!=='')sParamsProd+='&'+ (FCLib$.fnUseEHC()?"a":"adicional") +'d2_'+ IDSubProd +'='+ EncodeParamFC(fn.charCode(product.adicionalD2));
      if(product.adicionalD3!=='')sParamsProd+='&'+ (FCLib$.fnUseEHC()?"a":"adicional") +'d3_'+ IDSubProd +'='+ EncodeParamFC(fn.charCode(product.adicionalD3));
      btnAnimation(posBtnComprar);
      if(FC$.FBPixelCode)FCLib$.fnFBAddToCart(product);
      if(FC$.PinterestTagID)FCLib$.fnPinterestAddToCart(product,iQtyIncMult);
      if(FC$.TikTokPixelID)FCLib$.fnTikTokAddToCart(product,iQtyIncMult);
      if(FC$.GA)FCLib$.fnGoogleAddToCart(product,iQtyIncMult);
      AjaxExecFC(FCLib$.uk("url-add-multiple-products"),"xml=1"+sParamsProd,true,processXMLAddMult,FC$.IDLoja,posBtnComprar,sParamsProd);
    }else{

      if(options.incMultGrid){
        var IDSubProd=product.IDProduto, oParams=[];
        oParams.push(['IDProduto', IDSubProd]);
        oParams.push(['QTIncMult_'+IDSubProd, iQtyIncMult]);
        oParams.push(['IDLoja', FC$.IDLoja]);
        oParams.push(['PostMult', true]);

        if(sNameColor!=='')oParams.push([(FCLib$.fnUseEHC()?"color":"cor")+'_'+ IDSubProd, sNameColor]);
        if(product.adicional1!=='')oParams.push([(FCLib$.fnUseEHC()?"a":"adicional")+'1_'+ IDSubProd,fn.charCode(product.adicional1)]);
        if(product.adicional2!=='')oParams.push([(FCLib$.fnUseEHC()?"a":"adicional")+'2_'+ IDSubProd,fn.charCode(product.adicional2)]);
        if(product.adicional3!=='')oParams.push([(FCLib$.fnUseEHC()?"a":"adicional")+'3_'+ IDSubProd,fn.charCode(product.adicional3)]);
        if(product.adicionalD1!=='')oParams.push([(FCLib$.fnUseEHC()?"a":"adicional")+'d1_'+ IDSubProd,fn.charCode(product.adicionalD1)]);
        if(product.adicionalD2!=='')oParams.push([(FCLib$.fnUseEHC()?"a":"adicional")+'d2_'+ IDSubProd,fn.charCode(product.adicionalD2)]);
        if(product.adicionalD3!=='')oParams.push([(FCLib$.fnUseEHC()?"a":"adicional")+'d3_'+ IDSubProd,fn.charCode(product.adicionalD3)]);

        fn.sendPost(FCLib$.uk("url-add-multiple-products"), oParams);

      }else{
        var sURLBuy=FCLib$.uk("url-add-product") +'?'+ (FCLib$.fnUseEHC()?"productid":"idproduto") +'='+ product.IDProduto;
        if(sNameColor!=='')sURLBuy+='&'+ (FCLib$.fnUseEHC()?"color":"cor") +'='+ sNameColor.replace(/\+/g,'%2B');
        if(product.adicional1!=='')sURLBuy+='&'+(FCLib$.fnUseEHC()?"a":"adicional")+'1='+ fn.encodeURI(fn.charCode(product.adicional1));
        if(product.adicional2!=='')sURLBuy+='&'+(FCLib$.fnUseEHC()?"a":"adicional")+'2='+ fn.encodeURI(fn.charCode(product.adicional2));
        if(product.adicional3!=='')sURLBuy+='&'+(FCLib$.fnUseEHC()?"a":"adicional")+'3='+ fn.encodeURI(fn.charCode(product.adicional3));
        if(product.adicionalD1!=='')sURLBuy+='&'+(FCLib$.fnUseEHC()?"a":"adicional")+'d1='+ fn.encodeURI(fn.charCode(product.adicionalD1));
        if(product.adicionalD2!=='')sURLBuy+='&'+(FCLib$.fnUseEHC()?"a":"adicional")+'d2='+ fn.encodeURI(fn.charCode(product.adicionalD2));
        if(product.adicionalD3!=='')sURLBuy+='&'+(FCLib$.fnUseEHC()?"a":"adicional")+'d3='+ fn.encodeURI(fn.charCode(product.adicionalD3));
        top.location.href=sURLBuy;
      }
    }
  }

  function fnSelectForWishlist(oPos){
    if(oPos && FC$.Wishlist==1){
      var oBtnWL=document.createElement("div");
      oBtnWL.setAttribute("class","ProdWLSel");
      oBtnWL.innerHTML=rk("grid-select-options-wishlist");
      oPos.appendChild(oBtnWL);
    }
  }

  function fnAddToWishlist(oPos,idp){
    if(FC$.Wishlist==1){
      var oBtnWL=document.createElement("div");
      oBtnWL.setAttribute("id","ProdWL"+ idp);
      oBtnWL.setAttribute("class","ProdWL");
      /* oPos.appendChild(oBtnWL); */
      /* fnInsertAfterGrid(oBtnWL,oPos); */
      fnInsertGridEnd(oBtnWL);
      if(typeof FuncButtonAddToWL==="function"){WL$.fnButtonAddToWishlist(idp);} else {FCLib$.onReady(function(){WL$.fnButtonAddToWishlist(idp);});}
      var el=document.querySelectorAll('.ProdWLSel');
      if(el.length>0){
        for(var i=0; i<el.length;i++){el[i].parentNode.removeChild(el[i]);} /* remove text telling you to select options */
      }
    }
  }

  function fnInsertAfterGrid(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function fnInsertGridEnd(newNode) {
    document.querySelector('.FCGridMain').appendChild(newNode)
  }

  function fnResetWishlist(){
    if(FC$.Wishlist==1){
      var el=document.querySelectorAll('.ProdWL');
      if(el.length==0)el=window.top.document.querySelectorAll('.ProdWL');
      if(el.length>0){
        for(var i=0; i<el.length;i++){el[i].parentNode.removeChild(el[i]);} /* remove buttons that already exist in the wishlist html */
      }
    }
  }

  function fnExistsProduct(IDProduto,descritores,descrAnterior,aProductList){
    var sParms="";
    for(var i=0; i<aProductList.length; i++){
      var prd = JSON.parse(aProductList[i]);
      if(parseInt(prd.IDProduto) === parseInt(IDProduto)){
        sParms= "IDProduto="+ prd.IDProduto;
        for(var j=0; j<descritores.length; j++){
          if(descrAnterior[j] == prd[descritores[j]]){
            if((descritores[j]).toUpperCase() == "COR"){sParms+= "&"+ descritores[j] +"="+ fn.getColor(descrAnterior[j]).name;}else{sParms+= "&"+ descritores[j] +"="+ descrAnterior[j];}
          }
        }
        fn.setAttrProduct(prd); /* Select subproduct and Set in var product */
      }
    }

    var oButton=fn.availableBuyProduct(product,sParms); /* check availability and create the button [buy/ sold out/ consult us] */
    fn.setPriceProduct(product); /* update the product value according to the by-product value */
    fn.setCodeProduct(product);/* update the product reference code */

    var el=document.querySelectorAll('#idButtonBuyFC_'+ iGridAtual +' .FCBtnGrid');
    if(el.length>0)for(var i=0; i<el.length;i++){el[i].parentNode.removeChild(el[i]);} /* remove buttons that already exist in the html */

    var oPositionBtn = document.getElementById('idButtonBuyFC_'+ iGridAtual);
    if(!oPositionBtn){
      var verifyOtherButton = window.top.document.getElementById('cartBtnImg_1');
      if(verifyOtherButton){verifyOtherButton.parentNode.removeChild(verifyOtherButton);}
      var verifyEsgotBt = window.top.document.querySelector('.FCBtnEsgotadoGrid');
      if(verifyEsgotBt){verifyEsgotBt.parentNode.removeChild(verifyEsgotBt);}
      oPositionBtn = window.top.document.getElementById('idButtonBuyFC_'+ iGridAtual);
    }
    oPositionBtn.appendChild(oButton);
    fnAddToWishlist(oPositionBtn,product.IDProduto);

    /* displays the product summary, descriptors and attributes */
    var oPositionDetail = document.getElementById('idDetailProduct_'+ iGridAtual);
    var oPositionButtonBuy = document.getElementById('idButtonBuyFC_'+ iGridAtual);

    if(!oPositionDetail){
      var oPositionHtml = document.getElementById(settings.idElementGrid);
      var oNewElement = document.createElement("Div");
          oNewElement.className='FCBoxGrid FCResumeProduct';
          oNewElement.id="idDetailProduct_"+ iGridAtual;
          oNewElement.innerHTML = fn.getDetailsProduct();
      if(oPositionButtonBuy)oPositionButtonBuy.parentNode.insertBefore(oNewElement, oPositionButtonBuy);
    }else{
      oPositionDetail.innerHTML=fn.getDetailsProduct();
    }
    /*fn.consoleLogFC({'FC_Log_Grid_v1' : 'descritores do produto selecionado', 'dscr' : sParms.replace(/\&/g,', ').replace(/\=/g,' : ')});*/ /* Log the parameters of the selected product */
  }

  /*fnResetOptions:begin*/
  function fnResetOptions(objElementParent){
    iGridAtual=objElementParent.getAttribute("data-grid");
    if(iGridAnterior==0)iGridAnterior=iGridAtual;
    var bMudouActiveGrid=(iGridAtual!=iGridAnterior); /* check if the grid has been clicked on */
    if(bMudouActiveGrid){
      fnInitProductList(aProductList,iGridAnterior); /*recreate the options from the previous grid*/
      iGridAnterior=iGridAtual;
    }
    aProductList=aProductListAll[iGridAtual-1];
    settings=JSON.parse(aSettingsAll[iGridAtual-1]);
    if(options.incMultGrid)fn.qtyIncFieldDisabled(true, false);
    fn.getShippingView(false); /* shipping simulation */
    var el=document.querySelectorAll('#idButtonBuyFC_'+ iGridAtual +' .FCBtnGrid');
    if(el.length==0)el=window.top.document.querySelectorAll('#idButtonBuyFC_'+ iGridAtual +' .FCBtnGrid');
    var elSelect=document.querySelectorAll('#idButtonBuyFC_'+ iGridAtual +' .FCBtnSelectedOption');
    if(elSelect.length==0)elSelect=window.top.document.querySelectorAll('#idButtonBuyFC_'+ iGridAtual +' .FCBtnSelectedOption');
    if(el.length>1)el[0].parentNode.removeChild(el[0]);
    if(el.length>0 && elSelect.length===0){
      for(var i=0; i< el.length;i++){el[i].parentNode.removeChild(el[i]);} /* remove buttons that already exist in the html */
      if(elSelect.length===0){
        var oButton=fn.availableBuyProduct(null);
        var oPositionBtn = document.getElementById('idButtonBuyFC_'+ iGridAtual) || window.top.document.getElementById('idButtonBuyFC_'+ iGridAtual);
        if(oPositionBtn){oPositionBtn.appendChild(oButton);fnResetWishlist();}
      }
    }
    var obj=objElementParent.getElementsByTagName("span")[0];
    var iNivelAtual=objElementParent.getAttribute("data-nivel");
    var sDescritorAtual=obj.getAttribute("data-attr");
    var srcImgDet=obj.getAttribute("data-img-det");
    var srcImgAmp=obj.getAttribute("data-img-amp");

    if(srcImgDet!= null && srcImgAmp!= null)fn.imgView(srcImgDet, srcImgAmp, true);
    fn.removeClass(document.querySelectorAll('[id*=idNivelGridFC_'+ iNivelAtual+'] .FCDescritorContent li'), 'FCSelectedGrid'); /* remove class from LIs when an option is clicked */
    fn.addClass(objElementParent,"FCSelectedGrid"); /* adds class to the element when it is clicked */
    var getTextToChange=objElementParent.parentElement.previousElementSibling.children[1];
    if(getTextToChange)getTextToChange.innerText=rk('grid-choose-options-text')+": " 

    if(parseInt(iNivelAtual)==0)aDescriptorsPrevious=[];
    aDescriptorsPrevious[parseInt(iNivelAtual)]=sDescritorAtual;
    settings.descriptorsPrevious=aDescriptorsPrevious; /*define the descriptor that was clicked and add the variable*/

    var aDestinosDescritores = settings.descriptorsActive; /*defines the existing descriptors in the products*/
    var oPositionHtml = document.getElementById(settings.idElementGrid);
    var iNextNivel = parseInt(iNivelAtual)+1;
    /*include the values of the selected descriptors at each level eg. (Grey+Red)*/
    if(aDestinosDescritores[iNivelAtual].toUpperCase() == 'COR'){
      document.getElementById('idNivelGridFC_'+ iNivelAtual +'_select_'+ iGridAtual).innerHTML= "("+ fn.getColor(sDescritorAtual).name +")";
    }else{
      document.getElementById('idNivelGridFC_'+ iNivelAtual +'_select_'+ iGridAtual).innerHTML= "("+ sDescritorAtual +")";
    }

    for(var i=iNextNivel; i< aDestinosDescritores.length; i++){
      var sHtmlUL="<ul class=\"FCDescritorContent\">";
      if(i==iNextNivel){var sDisabled="FCDescritorGridActivated", oClickEvent="onClick=FCGrid$.fnResetOptions(this)";}else{var sDisabled = "FCDescritorGridDisabled", oClickEvent="";}
      if(aDestinosDescritores.length > 0){
        var sClassDescritor = fn.classDescriptor(aDestinosDescritores[i]); /*defines a specific class for each level of descriptors*/
        var oSelectProductsList = fnSelectsProducts(aProductList, sDescritorAtual, iNivelAtual); /*selects the products according to the selected level*/
        if(aDestinosDescritores.length>1){
          var aItens = fn.eliminateDuplicates(fn.getDescriptorValueProducts(oSelectProductsList, aDestinosDescritores[i])); /* remove duplicate values [array of products, descriptor eg. COLOR]*/
        }else{
          var aItens = fn.getDescriptorValueProducts(aProductList, aDestinosDescritores[i]);
        }
        for(var j=0; j < aItens.length;j++){
          var sDescriptorValueReset = aItens[j]; /* eg Gray+Light Blue|0066FF*/
          var oFlagEsgotado = fn.productAvailableFlag(null); /*returns 'htmlLabel': "", 'classLabel' : ""*/
          if(iNivelAtual==(aDestinosDescritores.length-2)){
            var oProductSelect = fnSelectsProducts(aProductList, sDescriptorValueReset, parseInt(iNivelAtual)+1);
            oFlagEsgotado = fn.productAvailableFlag(oProductSelect, iNivelAtual);
          }
          /* product image */
          var sDataImagesProd="";
          if((options.imageProduct).toUpperCase() == (aDestinosDescritores[i]).toUpperCase()){
            var descriptorImg = sDescriptorValueReset;
            sDataImagesProd = fn.srcProduct(i, descriptorImg, aProductList);
          }
          /*create LI element > SPAN / check if the by-product is available [x] [!]*/
          /* If it is from the color descriptor */
          if((aDestinosDescritores[i]).toUpperCase() == 'COR'){
            if(options.colorImg){
              var sBgColor = "url("+ settings.pathColorsImg + fn.getColor(sDescriptorValueReset).name.replace("+","_") + options.colorImgFormat +") no-repeat #"+ fn.getColor(sDescriptorValueReset).rgb +";";
            }else{
              var sBgColor = "#" + fn.getColor(sDescriptorValueReset).rgb;
            }
            var sNameCor= options.colorName == false ? "&nbsp;" : fn.getColor(sDescriptorValueReset).name; /*Display or not the color name*/
            sHtmlUL+="<li data-grid="+ iGridAtual +" class=\""+ sDisabled +" "+ oFlagEsgotado.classLabel +"\" data-nivel=\""+ i +"\" "+ oClickEvent +">"
                  +  options.htmlFlagChecked
                  +  "<span style=\"background:"+ sBgColor +"\" class=\"FCDescritorGrid "+ sClassDescritor  +"\" data-attr=\""+ sDescriptorValueReset +"\" "+ sDataImagesProd+">"
                  +     sNameCor + oFlagEsgotado.htmlLabel
                  +  "</span>"
                  +"</li>";
          }
          /* not color descriptor */
          else{
            sHtmlUL+="<li data-grid="+ iGridAtual +" class=\""+ sDisabled +" "+ oFlagEsgotado.classLabel +"\" data-nivel=\""+ i +"\" "+ oClickEvent +">"
               +  options.htmlFlagChecked
               +  "<span class=\"FCDescritorGrid "+ sClassDescritor +"\" data-attr=\""+ sDescriptorValueReset +"\" "+ sDataImagesProd+">"
               +     sDescriptorValueReset + oFlagEsgotado.htmlLabel
               +  "</span>"
               +"</li>";
          }
        }
        sHtmlUL+="</ul>";

        if(options.textDescriptor[ aDestinosDescritores[i] ] == "" || options.textDescriptor[ aDestinosDescritores[i] ]===undefined){
          var sTitDescr=rk("grid-select-text");
        }else{
          var sTitDescr=options.textDescriptor[ aDestinosDescritores[i] ]
        }

        var oElementExists = document.getElementById('idNivelGridFC_'+ i +'_'+ iGridAtual);
        if(!oElementExists){
          var oNewElement = document.createElement("Div");
          oNewElement.className='FCBoxGrid';
          oNewElement.id="idNivelGridFC_"+ i +'_'+ iGridAtual;
          oNewElement.innerHTML = "<div class=\"FCStepGrid\"><span class=\"FCStepGridNumber\">"+ parseInt(i+1) +"</span>"
                                +   "<span class=\"FCStepGridTitle\">"+ sTitDescr + "</span>"
                                + "</div>"+ sHtmlUL ;
          oPositionHtml.appendChild(oNewElement);
        }else{
          oElementExists.innerHTML= "<div class=\"FCStepGrid\">"
                                  +   "<span class=\"FCStepGridNumber\">"+ parseInt(i+1) +"</span>"
                                  +   "<span class=\"FCStepGridTitle\">"+ sTitDescr + "</span>"
                                  +   "<strong class=\"FCOptionSelected\" id='idNivelGridFC_"+ parseInt(i) +"_select_"+ iGridAtual +"'></strong>"
                                  + "</div>"+ sHtmlUL;
          /*Change text after selecting first grid item*/
          var titleDescritor1Sel=document.getElementById('idNivelGridFC_0_select_1');
          if(titleDescritor1Sel) titleDescritor1Sel.previousSibling.innerText= rk('grid-choose-options-text')+": ";
          /*END - Change text after selecting first grid item*/                                
        }
      }
    }
    /* checks if it is the last descriptor level */
    if(iNivelAtual==(aDestinosDescritores.length-1)){
      var oSelectProductsList = fnSelectsProducts(aProductList, sDescritorAtual, iNivelAtual);
      var IDProdutoData=obj.getAttribute("data-id");
      if(IDProdutoData!= null){
        IDProdutoData=IDProdutoData;
      }else{
        var IDProduto = fn.getDescriptorValueProducts(oSelectProductsList, 'IDProduto');
        IDProdutoData=IDProduto[0];
      }
      fnExistsProduct(IDProdutoData, settings.descriptorsActive, settings.descriptorsPrevious, aProductList);      
      /*SPY2 remove duplicate button */
      var el1=window.top.document.querySelectorAll('#idButtonBuyFC_'+ iGridAtual +' .FCBtnGrid');
      if(el1.length>1)el1[0].parentNode.removeChild(el1[0]);          
    }
    else{
      /* clear the product summary, descriptors and attributes */
      var oPositionDetail=document.getElementById('idDetailProduct_'+ iGridAtual);
      if(oPositionDetail)oPositionDetail.innerHTML="";
    }
  }
  /*fnResetOptions:end*/

  /*fnInitProductList:begin*/
  function fnInitProductList(aProductList,iGridProd){
    var sDataImagesProd="";
    settings.descriptorsActive=fn.setActiveDescriptors(aProductList, options.qtyDescriptors); /*defines existing descriptors [array of products, quantity of descriptors]*/
    aSettingsAll.push(JSON.stringify(settings));
    var aDestinosDescritores=settings.descriptorsActive;

    if(!settings.descriptorsActive || settings.descriptorsActive.length == 0)return false; /* if there are sub-products with an error in the registration (absence of descriptors) */

    var oPositionHtml = document.getElementById( settings.idElementGrid );
    oPositionHtml.innerHTML="";

    if(options.textGrid!=="" && oPositionHtml){
      var oNewElement=document.createElement("div");
      oNewElement.setAttribute("id","idTxtGridFC_"+ iGridProd);
      oNewElement.setAttribute("class","FCTxtGrid");
      oNewElement.innerHTML=options.textGrid;
      oPositionHtml.appendChild(oNewElement);
    }
    for(var i=0; i< aDestinosDescritores.length; i++){
      var sBgColor="", sHtmlUL="<ul class=\"FCDescritorContent\">";
      if(i==0){var sDisabled="FCDescritorGridActivated", oClickEvent="onClick=FCGrid$.fnResetOptions(this);FCGrid$.selectSecondLonelyGradeItem()"}else{var sDisabled = "FCDescritorGridDisabled", oClickEvent=""}

      if(aDestinosDescritores.length>0)
      {
        var sClassDescritor=fn.classDescriptor(aDestinosDescritores[i]); /* define a class for each descriptor */

        if(fn.isSingleDescriptor()){ /* Has only one descriptor? Only one option level*/

          var uniqueDescriptorsAll = []  /* stores the descriptor of all the by-products and then creates the duplicate existence */
          for(var j=0; j<aProductList.length;j++){
            var prd = JSON.parse(aProductList[j]);

            if((options.imageProduct).toUpperCase() == (aDestinosDescritores[i]).toUpperCase()){
              sDataImagesProd=" data-img-det="+ prd['imgDet'] +" data-img-amp="+ prd['imgAmp']; /*Get the detailed product image/ enlarged*/
            }

            var results=[];
            results.push(JSON.stringify(prd));
            var oFlagEsgotado=fn.productAvailableFlag(results); /* check if the by-product is available [x] [!]*/

            /* if it is from the color descriptor */
            if((aDestinosDescritores[i]).toUpperCase() == 'COR'){
              if(options.colorImg){
                var sBgColor = "url("+ settings.pathColorsImg + fn.getColor(prd['cor']).name.replace("+","_") + options.colorImgFormat +") no-repeat #"+ fn.getColor(prd['cor']).rgb +";";
              }else{
                var sBgColor = "#" + fn.getColor(prd['cor']).rgb;
              }
              var sNameCor= options.colorName == false ? "&nbsp;" : fn.getColor(prd['cor']).name; /*Display or not the color name*/
              sHtmlUL+="<li data-grid="+ iGridProd +" class=\""+ sDisabled +" "+ oFlagEsgotado.classLabel +"\" data-nivel=\""+i+"\" "+ oClickEvent +"\>"
                    +  options.htmlFlagChecked
                    +  "<span style=\"background:"+ sBgColor +"\" class=\"FCDescritorGrid "+ sClassDescritor +"\" data-attr=\""+ prd[aDestinosDescritores[i]] +"\""+ sDataImagesProd +"\ data-id=\""+ prd['IDProduto']+"\">"
                    +     sNameCor + oFlagEsgotado.htmlLabel
                    +  "</span>"
                    +"</li>";
            }
            /* not color descriptor */
            else{
              sHtmlUL+="<li data-grid="+ iGridProd +" class=\""+ sDisabled +" "+ oFlagEsgotado.classLabel +"\" data-nivel=\""+ i +"\" "+ oClickEvent +">"
                    +  options.htmlFlagChecked
                    +  "<span style=\""+ sBgColor +"\" class=\"FCDescritorGrid "+ sClassDescritor +"\" data-attr=\""+ prd[aDestinosDescritores[i]] +"\""+ sDataImagesProd +" data-id=\""+ prd['IDProduto'] +"\">"
                    +    prd[aDestinosDescritores[i]] + oFlagEsgotado.htmlLabel
                    +  "</span>"
                    +"</li>";
            }

            uniqueDescriptorsAll.push(prd[aDestinosDescritores[i]]); /*add the descriptor value to the array*/
          }
          /* check for duplicate descriptors */
          var uniqueDescriptorsResume = fn.eliminateDuplicates(uniqueDescriptorsAll);
          if(uniqueDescriptorsAll.length !== uniqueDescriptorsResume.length)fn.consoleLogFC({'FC_Log_Grid_v1' : 'Subproducts with duplicate descriptors', 'dscr' : uniqueDescriptorsAll});
        }
        else /* More than one descriptor eg. color / size */
        {
          var aItens = fn.eliminateDuplicates(fn.getDescriptorValueProducts(aProductList, aDestinosDescritores[i])); /* remove duplicate values [array of products, descriptor eg. COLOR]*/
          for(var j=0; j < aItens.length;j++){
            var sDescriptorValueInit = aItens[j]; /*ex. Gray+Light Blue|0066FF*/
            if((options.imageProduct).toUpperCase() == (aDestinosDescritores[i]).toUpperCase()){
              sDataImagesProd=fn.srcProduct(i, sDescriptorValueInit, aProductList); /* product image for data-img attribute */
            }

            if((aDestinosDescritores[i]).toUpperCase() == 'COR'){ /* if color attribute */
              if(options.colorImg){
                var sBgColor = "url("+ settings.pathColorsImg + fn.getColor( sDescriptorValueInit ).name.replace("+","_") + options.colorImgFormat +") no-repeat #"+ fn.getColor( sDescriptorValueInit ).rgb +";";
              }else{
                var sBgColor = "#"+ fn.getColor( sDescriptorValueInit ).rgb;
              }
              var sNameCor = options.colorName == false ? "&nbsp;" : fn.getColor(sDescriptorValueInit).name; /*Display or not the color name*/
              sHtmlUL+="<li data-grid="+ iGridProd +" class=\""+ sDisabled +"\" data-nivel=\""+ i +"\" "+ oClickEvent +">"
                    +  options.htmlFlagChecked
                    +  "<span style=\"background:"+ sBgColor +"\" class=\"FCDescritorGrid "+ sClassDescritor +"\" data-attr=\""+ sDescriptorValueInit +"\" "+ sDataImagesProd +">"
                    +    sNameCor
                    +  "</span>"
                    +"</li>";
            }else{
              sHtmlUL+="<li data-grid="+ iGridProd +" class=\""+ sDisabled +"\" data-nivel=\""+ i +"\" "+ oClickEvent +">"
                    +  options.htmlFlagChecked
                    +  "<span style=\""+ sBgColor +"\" class=\"FCDescritorGrid "+ sClassDescritor +"\" data-attr=\""+ sDescriptorValueInit +"\" "+ sDataImagesProd +">"
                    +    sDescriptorValueInit
                    +  "</span>"
                    +'</li>';
            }
          }
        }
        sHtmlUL+="</ul>"; /* closing UL element */

        var oNewDiv = document.createElement("Div");
        oNewDiv.className='FCBoxGrid FCNivelGrid_' +i;
        oNewDiv.id="idNivelGridFC_"+ i +'_'+ iGridProd;

        if(options.textDescriptor[ aDestinosDescritores[i] ] == "" || options.textDescriptor[ aDestinosDescritores[i] ]==undefined){
          var sTitDescr=rk("grid-select-text");
        }else{
          var sTitDescr=options.textDescriptor[ aDestinosDescritores[i] ]
        }
        oNewDiv.innerHTML = "<div class=\"FCStepGrid\">"
                          +   "<span class=\"FCStepGridNumber\">"+ parseInt(i+1) +"</span>"
                          +   "<span class=\"FCStepGridTitle\">"+ sTitDescr + "</span>"
                          +   "<strong class=\"FCOptionSelected\" id='idNivelGridFC_"+ i +"_select_"+ iGridProd +"'></strong>"
                          + "</div>"+ sHtmlUL ;
        oPositionHtml.appendChild(oNewDiv);
      }
    }

    /* Create incMult */
    if(options.incMultGrid){
      var oNewDiv = document.createElement("Div");
      oNewDiv.setAttribute('class','FCBoxGrid FCFCBoxGridIncMult');
      var oLabelIncMult = document.createElement("span");
      oLabelIncMult.setAttribute('class','FCStepGridTitle FCTitQtyInc');
      oLabelIncMult.innerHTML = rk("grid-quantity");
      var oInputIncMult = fn.creatInputIncMultQty();

      var oPassoBuy = document.createElement("span");
      oPassoBuy.setAttribute('class','FCStepGridNumber');
      oPassoBuy.innerHTML = settings.descriptorsActive.length + 1;
      oNewDiv.appendChild(oPassoBuy);

      var oDivLabelInput = document.createElement('div');
      oDivLabelInput.style.cssText = "position:relative;width:auto;height:auto;float:left";

      oDivLabelInput.appendChild(oLabelIncMult);
      oDivLabelInput.appendChild(oInputIncMult);
      oNewDiv.appendChild(oDivLabelInput);
      oPositionHtml.appendChild(oNewDiv);         
          
          
    }

    /* buy button */
    var oPositionBtn = document.getElementById('idButtonBuyFC_'+ iGridProd);
    if(!oPositionBtn){
      var oDivButtonBuy = document.createElement("div");
          oDivButtonBuy.setAttribute('id','idButtonBuyFC_'+ iGridProd);
          oDivButtonBuy.setAttribute('class','FCBoxGrid FCBoxGridBuy');

      var iStepBuy = options.incMultGrid == true ? 2 : 1;
      var oPassoBuy = document.createElement("span");
          oPassoBuy.setAttribute('class','FCStepGridNumber');
          oPassoBuy.innerHTML= settings.descriptorsActive.length + iStepBuy;
      oDivButtonBuy.appendChild(oPassoBuy);
      oPositionHtml.appendChild(oDivButtonBuy);
    }
    
    FCLib$.onLoaded(function(){
      /* if the first descriptor has only one option, it is selected */
      var howManyFirsts=document.querySelectorAll('li[data-nivel="0"]');
      if(howManyFirsts && howManyFirsts.length==1){
          var oProd=document.querySelectorAll('li[data-nivel="0"]');
          if(oProd[0]!==null)fnResetOptions(oProd[0]);
      }

      /* Select by-product with parameter */
      var attrType="cor";/*needs to be set manually*/
      var getURLtoSelectItem=location.search;
      var regexPattern=/(.*)(attr)(\=|\,)(\w{1,7})(.*)/g;
      var getAttr=(getURLtoSelectItem.replace(regexPattern,'$4')).toUpperCase();
      howManyFirsts.forEach(function(item){
        var itemDataSet=(item.children[1].dataset.attr).toUpperCase();
        if(attrType=="cor" && getAttr!="" && itemDataSet.indexOf(getAttr)>-1)fnResetOptions(item);
        if(attrType=="tamanho" && getAttr!="" && itemDataSet==getAttr)fnResetOptions(item);
      });
      /* END - Select by-product with parameter */

      /* run function that checks according to descriptor */
      selectSecondLonelyGradeItem();
    });

    /*select the first sub-product automatically*/
    function autoSelectRun(){
      if(options.autoSelect && aSettingsAll.length==1){
        for(var i=0;i<aDestinosDescritores.length;i++){
          var oProd=document.querySelectorAll('li[data-nivel="'+ i +'"]');
          if(oProd[0]!==null)fnResetOptions(oProd[0]);
        }
      if(fn.isSingleDescriptor())fn.getShippingView(true) /* shipping simulation */
      }else{
        var oButton=fn.availableBuyProduct(null);
        var oPositionBtn=document.getElementById('idButtonBuyFC_'+ iGridProd);
        if(oPositionBtn)oPositionBtn.appendChild(oButton);
        fnSelectForWishlist(oPositionBtn);
        fn.getShippingView(false) /* shipping simulation */
      }
    }
    autoSelectRun();
    if(options.autoSelect)FCLib$.onReady(function(){ autoSelectRun(); });
  }
  
  /*fnInitProductList:end*/

  /*fnInitProductOnlyOne:begin*/
  function fnInitProductOnlyOne(aProductOnlyOne,iGridProd){
    var oPositionHtml = document.getElementById( settings.idElementGrid );
    var oProd = JSON.parse(aProductOnlyOne);
    var sParms= "IDProduto="+oProd.IDProduto;

    var fnBuildHtmlAdic=function(oProd){
      var sHtmlAdic="";
      for(var i=0; i<options.order.length;i++){
        if(oProd[options.order[i]]!==""){
          if(options.order[i].toUpperCase() == "COR"){
            var sNomeAdic=fn.getColor(oProd.cor).name + "<span class=\"AdicItemCor\" style=\"background:#"+ fn.getColor(oProd.cor).rgb +"\">&nbsp;</span>";
          }else{
            var sNomeAdic=oProd[options.order[i]];
          }
          sHtmlAdic+="<div class=\"FCGridAdicContent\"><span class=\"AdicNome\">"+ options.nameDescriptor[options.order[i]] +"</span><span class=\"AdicItem\">"+ sNomeAdic +"</span></div>";
        }
      }

      /*quantity in stock*/
      if(options.stock){
        var iEstoqueDetail = parseInt(oProd.estoque), fPriceDetails = parseFloat(oProd.priceNum);
        sHtmlAdic+= "<div class=\"FCGridAdicContent zf-qty-estoque\">"+ fn.viewStock(iEstoqueDetail, fPriceDetails) +"</div>";
      }
      return sHtmlAdic;
    }

    var oNewDiv = document.createElement("Div");
          oNewDiv.className='FCBoxGrid FCResumeProduct';
          oNewDiv.id="idDetailProduct_"+ iGridProd;
          oNewDiv.innerHTML= fnBuildHtmlAdic(oProd);
          oPositionHtml.appendChild(oNewDiv);

    if(options.incMultGrid){
      var oNewDiv=document.createElement("Div");
          oNewDiv.setAttribute('class','FCBoxGrid FCFCBoxGridIncMult');
      var oLabelIncMult=document.createElement("span");
          oLabelIncMult.setAttribute('class','FCTitQtyInc');
          oLabelIncMult.innerHTML= rk("grid-quantity");
      var oInputIncMult=fn.creatInputIncMultQty();
          oNewDiv.appendChild(oLabelIncMult);
          oNewDiv.appendChild(oInputIncMult);
          oPositionHtml.appendChild(oNewDiv);
    }

    fn.setAttrProduct(oProd); /*defines the selected product and includes it in the product variable*/
    var oButton = fn.availableBuyProduct(oProd, sParms); /*check availability and create the button [buy/out of stock/contact us]*/
    var el=document.querySelectorAll('#idButtonBuyFC_'+ iGridProd +' .FCBtnGrid');
    if(el.length>0)for(var i=0; i< el.length;i++){el[i].parentNode.removeChild(el[i]);} /* remove buttons that already exist in the html */

    var oPositionBtn = document.getElementById('idButtonBuyFC_'+ iGridProd);
    if(!oPositionBtn){
      var oDivButtonBuy = document.createElement("div");
          oDivButtonBuy.setAttribute('id', 'idButtonBuyFC_'+ iGridProd);
          oDivButtonBuy.setAttribute('data-idproduto',oProd.IDProduto);
          oDivButtonBuy.setAttribute('data-grid',iGridQtd);
          oDivButtonBuy.setAttribute('class', 'FCBoxGrid FCBoxGridBuy FCBoxGridOnly');
      oPositionHtml.appendChild(oDivButtonBuy);
    }
    oPositionBtn = document.getElementById('idButtonBuyFC_'+ iGridProd);
    oPositionBtn.appendChild(oButton);
    fnAddToWishlist(oPositionBtn,oProd.IDProduto);
  }
  /*fnInitProductOnlyOne:end*/

  function fnMultipleZoom(imgDet,imgAmp,refresh){
    if(imgDet!=="" && imgAmp!== "") return fn.imgView(imgDet,imgAmp,refresh);
  }

  /*start the function*/
  function init(id, aProductListGrid, aProductOnlyOneGrid){
    iGridQtd++;

    settings.idElementGrid = id; /*set ID in DIV*/
    if(myOptions)options = fn.marge(options, myOptions); /*change settings*/

    aProductOnlyOne = fn.convertCharAT(aProductOnlyOneGrid);
    aProductOnlyOneAll.push(aProductOnlyOne);
    aProductList = fn.convertCharAT(aProductListGrid);
    aProductListAll.push(aProductList);

    if(typeof aProductListGrid[aProductListGrid.length-1] !== 'undefined'){
      fnInitProductList(aProductList,iGridQtd); /* if subproduct */
    }else{
      aSettingsAll.push(JSON.stringify(settings));
      fnInitProductOnlyOne(aProductOnlyOneGrid,iGridQtd);
    }
  }

  function fnExecTabDescriptors(){
    if(typeof aProductList[aProductList.length-1] == 'undefined'){ aProductList=aProductOnlyOne; }
    var aDados = ["IDProduto","codProd","cor","estoque","peso","priceOri","priceNum","adicional1","adicional2","adicional3","adicionalD1","adicionalD2","adicionalD3","imgDet","imgAmp"];
    var oTable = document.createElement("table"); oTable.border="1";

    var TRnode = document.createElement("tr");
    for(var i=0; i<aDados.length; i++ ){ var THnode = document.createElement("th");THnode.style.border="1px solid #ccc";THnode.style.padding="3px 8px";THnode.innerHTML = [aDados[i]]; TRnode.appendChild(THnode)}
    oTable.appendChild(TRnode);

    for(var i=0; i<aProductList.length;i++){
      var TRnode = document.createElement("tr");
      var prd = JSON.parse(aProductList[i]);
      for(var j=0; j<aDados.length; j++ ){ var TDnode = document.createElement("td");TDnode.style.border="1px solid #ccc";TDnode.style.padding="3px 8px";TDnode.innerHTML = prd[aDados[j]]; TRnode.appendChild(TDnode);}
      oTable.appendChild(TRnode);
    }
    var oNewElement=document.createElement("div");oNewElement.setAttribute("id","idTabDescritoresGridFC");oNewElement.setAttribute("class","FCTabDescritoresGrid");oNewElement.appendChild(oTable);
    document.body.appendChild(oNewElement);
  }

  function fnGridAll(oProdTags,aSubProdTags){
    var IsFromSpy=(document.location.href.indexOf("sty,5")>-1 || document.location.href.indexOf("sty=5")>-1);
    if(FC$.PinterestTagID && IsFromSpy)FCLib$.fnPinterestPageVisitProd(oProdTags);
    if(oProdTags.ImagemProdDet!= null && oProdTags.ImagemProdAmp!= null)fn.imgView(oProdTags.ImagemProdDet,oProdTags.ImagemProdAmp,true);
    fnMultipleZoom(oProdTags.ImagemProdDet,oProdTags.ImagemProdAmp,false);
    var aProductOnlyOneGrid=[],aProductListGrid=[];

    /* Begin: main product */
    var sCor= (oProdTags.CorVal !="") ? oProdTags.CorVal +"|"+ oProdTags.CorRGB:"";
    aProductOnlyOneGrid.push(JSON.stringify({IDProduto: oProdTags.IDProduto,codProd: oProdTags.CodProd, cor: sCor, estoque: oProdTags.Estoque, peso: oProdTags.PesoNum, priceOri: oProdTags.PrecoOri, priceNum: oProdTags.PrecoNum, maxInstallmentsNum: oProdTags.MaxParcelasProdNum, adicional1: oProdTags.Adicional1Val, adicional2: oProdTags.Adicional2Val, adicional3: oProdTags.Adicional3Val, adicionalD1: oProdTags.AdicionalD1Val, adicionalD2:oProdTags.AdicionalD2Val, adicionalD3:oProdTags.AdicionalD3Val, imgDet:oProdTags.ImagemProdDet, imgAmp:oProdTags.ImagemProdAmp, IDProdutoPai:oProdTags.IDProduto, ProdName:oProdTags.ProdName, ProdCategory:oProdTags.ProdCategory}));
    /* End: main product */

    /* Begin: list subproducts */
    var iSubProdTags=aSubProdTags.length;
    for(var i=0;i<iSubProdTags;i++){
      var sCor= (aSubProdTags[i].CorVal !="") ? aSubProdTags[i].CorVal +"|"+ aSubProdTags[i].CorRGB:"";
      aProductListGrid.push(JSON.stringify({IDProduto: aSubProdTags[i].IDProduto, codProd: aSubProdTags[i].CodProd, cor: sCor, estoque: aSubProdTags[i].Estoque, peso: aSubProdTags[i].PesoNum, priceOri: aSubProdTags[i].PrecoOri, priceNum: aSubProdTags[i].PrecoNum, maxInstallmentsNum: aSubProdTags[i].MaxParcelasProdNum, adicional1: aSubProdTags[i].Adicional1Val, adicional2: aSubProdTags[i].Adicional2Val, adicional3: aSubProdTags[i].Adicional3Val, adicionalD1: aSubProdTags[i].AdicionalD1Val, adicionalD2:aSubProdTags[i].AdicionalD2Val, adicionalD3:aSubProdTags[i].AdicionalD3Val, imgDet:aSubProdTags[i].ImagemProdDet, imgAmp:aSubProdTags[i].ImagemProdAmp, IDProdutoPai:oProdTags.IDProduto,ProdName:oProdTags.ProdName,ProdCategory:oProdTags.ProdCategory}));
    }
    /* End: list subproducts */

    /* optional code to change grid settings:begin */
    myOptions={
      autoSelect: false,
      cartOnPage: true,
      shippingUpdate: false,
      incMultGrid: false,
      separadorRGBCor: '|',
      qtyDescriptors: 7,
      htmlFlagChecked: '<i class="FCCheckedGrid"></i>',
      imageProduct: 'cor',
      colorName: false,
      colorImg: false,
      colorImgFormat: '.gif',
      stock: false,
      btnSelectImg: rk('grid-choose-options-above-button'),
      btnBuyImg: rk('grid-add-to-cart-button'),
      btnContactUSImg: rk('grid-contact-us-button'),
      btnSoldOut: rk('grid-sold-out-button'),
      btnVideo: 'icon-grid-play.svg?cccfc=1',      
      textGrid: rk('grid-text-select-options-below'),
      order: ['cor','adicional1','adicional2','adicional3','adicionalD1','adicionalD2','adicionalD3'],
      nameDescriptor:{
        cor: 'Cor',
        adicional1: oProdTags.NomeAdicional1,
        adicional2: oProdTags.NomeAdicional2,
        adicional3: oProdTags.NomeAdicional3,
        adicionalD1: oProdTags.NomeAdicionalD1,
        adicionalD2: oProdTags.NomeAdicionalD2,
        adicionalD3: oProdTags.NomeAdicionalD3
      },
      textDescriptor:{
        cor: rk('grid-select-text'),
        adicional1: rk('grid-select-text'),
        adicional2: rk('grid-select-text'),
        adicional3: rk('grid-select-text'),
        adicionalD1: rk('grid-select-text'),
        adicionalD2: rk('grid-select-text'),
        adicionalD3: rk('grid-select-text')
      }
    };
    /* optional code to change grid settings:end */

    init("idMainGridFC_"+ oProdTags.IDProduto,aProductListGrid,aProductOnlyOneGrid); /* Start the grid */
  }

  /*Check duplicate buy button*/
  function checkDuplicateButtonBuyButton(){
    var el=document.querySelectorAll('#idButtonBuyFC_1 .FCBtnGrid');
    if(el.length==0)el=window.top.document.querySelectorAll('#idButtonBuyFC_1 .FCBtnGrid');
    if(el.length>1){
      for(var i=1; i< el.length;i++){
        el[i].parentNode.removeChild(el[i].nextElementSibling);
        el[i].parentNode.removeChild(el[i]);
      }
    }
  }
  FCLib$.onLoaded(function(){ checkDuplicateButtonBuyButton(); });

  /*if second descriptor has only one option, it is selected*/
  function selectSecondLonelyGradeItem(){
    var isFirstSelected=document.querySelector('.FCSelectedGrid');
    var howManySeconds=document.querySelectorAll('li[data-nivel="1"]');
    if(isFirstSelected && howManySeconds.length==1){
        var oProd=document.querySelectorAll('li[data-nivel="1"]');
        if(oProd[0] !== null)fnResetOptions(oProd[0]);
    }
  }

  return{
    init:init,
    myOptions:myOptions,
    fnResetOptions:fnResetOptions,
    fnMultipleZoom:fnMultipleZoom,
    fnExecTabDescriptors:fnExecTabDescriptors,
    fnGridAll:fnGridAll,
    iGridQtd:iGridQtd,
    showVideoGrid:showVideoGrid,
    selectSecondLonelyGradeItem:selectSecondLonelyGradeItem
  }
}();

var mzOptions = {};
mzOptions = {
  onZoomReady: function() {
    var zoomOpenAltImg = document.querySelector('.mz-zoom-window img');
    zoomOpenAltImg.setAttribute("alt","zoom");
    var zoomOpenAltImgThumb = document.querySelectorAll('.mz-lens img');
    for (i = 0; i < zoomOpenAltImgThumb.length; i++) {
      zoomOpenAltImgThumb[i].setAttribute("alt","thubmnails");
    } 
  },  
  onExpandOpen: function() {
    var zoomOpenAltImg = document.querySelector('.mz-hover-zoom img');
    zoomOpenAltImg.setAttribute("alt","zoom");
    var zoomOpenAltImgThumb = document.querySelectorAll('.magic-thumb img');
    for (i = 0; i < zoomOpenAltImgThumb.length; i++) {
      zoomOpenAltImgThumb[i].setAttribute("alt","thubmnails");
    } 
  },  
};
/* Grid [06/2023] v7 */