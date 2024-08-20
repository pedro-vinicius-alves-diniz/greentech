// RECUPERAR O ID DETALHE DO LOCALSTORAGE
var id = parseInt(localStorage.getItem('detalhe'));

// PEGAR OS PRODUTOS DO LOCALSTORAGE
var produtos = JSON.parse(localStorage.getItem('produtos'))

var item = produtos.find(produto => produto.id === id);

if(item){
    console.log('Produto encontrado', item);

    // ALIMETANDO OS CAMPOS DE DETALHES
    $('#preco-detalhe').html(item.preco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}));
    $('#preco-promocional-detalhe').html(item.preco_promocional.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}));
    $('#imagem-detalhe').attr('src', item.imagem);
    $('#nome-detalhe').html(item.nome);
    $('#rating-detalhe').html(item.rating);
    $('#like-detalhe').html(item.likes);
    $('#reviews-detalhe').html(`${item.reviews} reviews`);
    $('#descricao-detalhe').html(item.descricao);

    var tabelaDetalhes = $('#tabela-detalhe');

    item.detalhes.forEach(detalhe => {
        var linha = `
        <tr>
            <td>${detalhe.caracteristica}</td>
            <td>${detalhe.detalhes}</td>
        </tr>
        `;

        tabelaDetalhes.append(linha)
    })

}else{
    console.log('Produto não encontrado')
}

var carrinho = JSON.parse(localStorage.getItem('carrinho'))|| [];

// FUNÇÃO PARA ADICIONAR AO CARRINHO
function addCarrinho(item, quantidade){
    var itemNoCarrinho = carrinho.find(c => c.item.id === item.id);

    if(itemNoCarrinho){
        // JÁ TEM NO CARRINHO
        // ADD QUANTIDADE

        itemNoCarrinho.quantidade += quantidade;
        itemNoCarrinho.total_item = itemNoCarrinho.quantidade * item.preco_promocional
    }else{
        carrinho.push({
            item: item,
            quantidade: quantidade,
            total_item: quantidade * item.preco_promocional
        })
    }
 
    // ATUALIZAR CARRINHO
    localStorage.setItem('carrinho', JSON.stringify(carrinho))
}   


// CLICOU ADD CARRINHO
$('.add-cart').on('click', function(){
    addCarrinho(item, 1);

    var toastCenter = toastCenter = app.toast.create({
        text: `${item.nome} adicionado ao carrinho com sucesso`,
        position: 'center',
        closeTimeout: 2000,
      });

      toastCenter.open()
})