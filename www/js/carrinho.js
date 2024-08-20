var localCarrinho =  localStorage.getItem('carrinho');

if(localCarrinho){
    var carrinho = JSON.parse(localCarrinho);
    if(carrinho.length >0){
        //TEM ITENS NO CARRINHO
        //RENDERIZAR O CARRINHO
        renderizarCarrinho();

        //SOMAR TOTAIS PRODUTOS
        calcularTotal();
    }else{
        //MOSTRAR CARRINHO VAZIO
        carrinhoVazio();
    }
}else{
    //MOSTRAR CARRINHO VAZIO
    carrinhoVazio();
}

function renderizarCarrinho(){

    //ESVAZIAR A ÁREA DOS ITENS
    $('#listaCarrinho').empty();

    // PERCORRER O NOSSO CARRINHO E ALIMENTAR A ÁREA
    $.each(carrinho, function(index, itemCarrinho){
        var itemDiv = `
            <div class="item-carrinho" data-index=${index}>
                <div class="area-img">
                    <img src="${itemCarrinho.item.imagem}" alt="">
                </div>
                <div class="area-details">
                    <div class="details-top">
                        <span>${itemCarrinho.item.nome}</span>
                        <a data-index=${index} class="delete-item" href="#"><i class="ri-close-fill"></i></a>

                    </div>

                    <div class="details-middle">
                        <span>${itemCarrinho.item.principal_caracteristica}</span>
                    </div>

                    <div class="details-bottom">
                        <span>${itemCarrinho.item.preco_promocional.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                        <div class="count">
                            <a class="minus" data-index="${index}" href="#">-</a>
                            <input class="qtd" readonly type="text" value="${itemCarrinho.quantidade}">
                            <a class="plus" data-index="${index}" href="#">+</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('#listaCarrinho').append(itemDiv);
    })

    $('.delete-item').on('click', function(){
        var index = $(this).data('index');
    
        app.dialog.confirm('Tem certeza que quer excluir este item do carrinho?', 'Excluir Item', function(){
            // REMOVENDO ITEM
            carrinho.splice(index, 1);
    
            // ATUALIZANDO CARRINHO
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            calcularTotal();
            // ATUALIZANDO PAGE    
            app.views.main.router.refreshPage();
            
        });
    
        
    })

    $('.minus').on('click', function(){
        var index = $(this).data('index');
        console.log(index)

        if(carrinho[index].quantidade >1){
            carrinho[index].quantidade --;
            carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            app.views.main.router.refreshPage();
        }else{
            app.dialog.confirm(`Gostaria de remover o item <strong>${carrinho[index].item.nome}</strong>?`, 'Remover Item', function(){
                carrinho.splice(index, 1);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                renderizarCarrinho();
                calcularTotal();
            });
        }
    })

    $('.plus').on('click', function(){
        var index = $(this).data('index');
        console.log(index)

        carrinho[index].quantidade ++;
        carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderizarCarrinho();
        calcularTotal();
    })
}

function calcularTotal(){
    var totalCarrinho = 0;

    $.each(carrinho, function(index, itemCarrinho){
        totalCarrinho += itemCarrinho.total_item;
    });

    $('#subtotal').html(`<strong>${totalCarrinho.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</strong>`)
}

function carrinhoVazio(){
    console.log('Carrinho está vazio');
    $('#listaCarrinho').empty();

    $('#toolbarTotais').addClass('display-none');
    $('#toolbarCheckout').addClass('display-none');

    $('#listaCarrinho').html(`
        <div class="text-align-center">
            <img src='img/empty.gif' width=300>
            
        </div>
    `)
}

$('#esvaziar').on('click', function(){
    app.dialog.confirm('Tem certeza que quer esvaziar o carrinho?', 'Esvaziar Carrinho', function(){
        localStorage.removeItem('carrinho');
        app.views.main.router.refreshPage();
    })
})

