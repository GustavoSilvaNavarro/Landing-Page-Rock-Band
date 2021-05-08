//COMO PUSIMO EL JAVASCRIPT LO PUSE QUE CORRIERA ANTES DE QUE APAREZCA TODO EL HTML VOY A OBTENR ERROR YA QUE NO VA A VER UN BODY DE HTML PARA PODER INTERACTUAR YO LO QUE TENGO QUE HACER ES ASEGURARME QUE LA PAGINA HAYA SIGO CARGADA COMPLETAMENTE PARA PODER USAR EL DOM
if (document.readyState === 'loading') { //esto quiere decir que si esta cargando es decir aun no carga por completo va a jecutar el evento de abajo
    document.addEventListener('DOMContentLoaded', ready); //corre la funcion ready
} else { //ahora si no esta cargando es decir ya esta cargada al 100%
    ready(); //ejecutara ready
}

//FUNCION READY
function ready () { // QUE CONSIGO CON ESTO CONSIGO DE QUE ESTE CODIGO DE LOS BOTONES FUNCIONE DE MANERA AUTOMATICA SIN QUE HAYA CARGADO LA PAGINA AUN Y YA HABIENDO CARGADO LO EJECUTARA CON EL FIN DE PODER
    
    //FUNCION DE BOTONES PARA REMOVER COSAS DEL CARRTIO
    const removeCartItemButtons = document.getElementsByClassName('btn-danger');
    console.log(removeCartItemButtons);

    for (i=0; i < removeCartItemButtons.length; i++) {
        let button = removeCartItemButtons[i];
        button.addEventListener('click', removeCartItem);
    }

    //FUNCION PARA EDITAR LOS INPUTS O NUMERO EVITAR QUE HAYAN NEGATIVOS Y SE ACTUALICEN CONFORME LOS MODIFICO
    let quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for (i=0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i]; //reocrre toda la lista
        input.addEventListener('change', quantityChanged);
    }

    //PARA BOTONES AZULES DE ADD TO CART
    let addCartButtons = document.getElementsByClassName('shop-item-btn');
    for (i=0; i < addCartButtons.length; i++) {
        let button = addCartButtons[i];
        button.addEventListener('click', addToCartItem);
    }

    //FUNCIONALIDAD A PURHCASE BOTON PARA LAS COMPRAS
    document.querySelector('.btn-purchase').addEventListener('click', purchaseClicked);
}

//REMUEVE DEL CARRITO LOS ITENES
function removeCartItem (e) {
    let buttonClicked = e.target; //el e.target me muestar todo el elemento html
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

//ACTUALIZACION FRENTE A CAMIBIOS EN INPUT
function quantityChanged (e) {
    let input = e.target; //obtengo el html
    if (isNaN(input.value) || input.value <= 0) { //lo que verifico es si el valor de mi input no es un numero o si el valor del input es menor o igual a 0 entonces ejecuta
        input.value = 1; //sino se cumplen las condiciones setealo a uno
    }
    
    updateCartTotal(); //caso contrario ejecuta el total 
}

//AGREGO ALGUN ITEM A MI CARRITO
function addToCartItem (e) {
    let button = e.target
    let shopItem = button.parentElement.parentElement
    let title = shopItem.querySelector('.shop-item-title').innerText;
    let price = shopItem.querySelector('.shop-item-price').innerText;
    let imageSrc = shopItem.querySelector('.shop-item-image').src; // de esta forma solo obtengo la fuente de mi imagen que es lo que necesito
    addItemToCart(title, price, imageSrc);//creo funcion que permitira crear html para el carrito
    updateCartTotal();
}

//CREO HTML PARA AGREGAR MI ITEM AL CARRITO
function addItemToCart (title, price, image) {
    const div = document.createElement('div');
    div.classList.add('cart-row');
    let cartItems = document.querySelector('.cart-items');
    let cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    for (i=0; i < cartItemNames.length; i++) { //agrego esta validacion para poder recorrer la lista y verificar si el titulo ya esta en el carrito entonces no hago nada mas y pongo una alerta sino esta que siga el codigo para lograr poner un item mas
        if (cartItemNames[i].innerText === title) {
            alert('This item was already added to the Cart!');
            return //esto hara que se rompa el if y no haga nada ya que si eh agregado algo y ya esta ahi quiero que se detenga
        }         
    }

    div.innerHTML = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${image}" width="100px" height="100px">
            <span class="cart-item-title">${title}</span>
        </div>

        <span class="cart-price cart-column">${price}</span>

        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>
    `;
    cartItems.appendChild(div);
    div.querySelector('.btn-danger').addEventListener('click', removeCartItem); //agrego las mismas funcionalidades que los otros botones lo hago asi ya que las propiedades de esos botones las obtego cuando la pagina esta cargada y este cambio es depues de eso por eso no ejecutaba nada
    div.querySelector('.cart-quantity-input').addEventListener('change', quantityChanged); //lo mismo hago con el input
}

//FUNCIONALIDAD A BOTON PURCHASE
function purchaseClicked () {
    alert('Thank You for your Purchase!');
    const cartItems = document.querySelector('.cart-items');
    while (cartItems.hasChildNodes()) { //doy un loop while que se va a ejcutar hasta que sea falso la condicion el hasChildNodes le estoy diciendo si el elemento cardItems tiene nodos o elementos hijos ejecuta
        cartItems.removeChild(cartItems.firstChild); //le digo del elemento padre remueve los elemtnos hijo dentro coloco anda removiendo el primero de la lista y asi continuara hasta quedar vacio que es donde la condicion de while se encuentra vacia
    }
    updateCartTotal();
}

//UPDATE THE TOTAL PRICE
function updateCartTotal () {
    let carItemContainer = document.getElementsByClassName('cart-items')[0]; //COMO EL CAR-ITEMS ES UNO SOLO PERO EL GET ELEMENT BY CLASS NAME TE DEVULEVE UN ARRAY LE DIGO QUE SOLO QUIERO EL DE LA POSICION 0 QUE ES EL UNICO QUE HAY PERO PARA EVITAR LA LISTA
    let cartRows = carItemContainer.getElementsByClassName('cart-row'); //sin embargo navego una mas para obtener los elementos dentro de cart-items y obtengo los cart-rows
    
    let total = 0; //seteo el total en 0 para sumar los montos de productos
    //HAGO UN FOR LOOP PARA RECORRER TODOS LOS PRECIOS
    for(i=0; i < cartRows.length; i++) {
        let cartRow = cartRows[i];
        let priceElement = cartRow.getElementsByClassName('cart-price')[0];
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        let price = parseFloat(priceElement.innerText.replace('$', '')); //con innerText o HTMLpuedo ver el texo o el html dentro del elemento ahora como es un string debo quitarle el simbolo de dolar lo dejo vacio asi dejo el numero pero como es un string lo debo volver convertir a numero CON PARSEFLOAT LO PASO DE STRING A NUMERO DECIMAL POR ESO ES EL FLOAT
        let quantity = quantityElement.value;
        total = total + (price * quantity);
    }

    //REDONDEAR LOS NUMEROS A DOS DECIMALES YA QUE NO SE VE BONITO TODOS LOS DECIMALES
    total = Math.round(total * 100) / 100;    
    //TENER CUIDADO QUE EL ATRIBUTO GETELEMTNSBYCLASSNAME DA UNA LISTA DE ELEMETNOS HTML EN CAMBIO EL QUERY SELECTOR DA DE ARRANQUE EL ELEMENTO HTML SIN USAR LISTAS al igual que QUERYSLECTOR EL GETELEMENTBYID DA TMABIEN EL ELEMENTO SIN LISTAS NI NADA
    document.querySelector('.cart-total-price').innerHTML = '$' + total; //en este caso conviene usar query selector
}