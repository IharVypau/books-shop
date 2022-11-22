
class Book{
  constructor(id,title, description,authors, imgUrl,price){
    this.id=id
    this.title=title
    this.description=description
    this.authors=authors
    this.imgUrl=imgUrl
    this.price=price
    this._amount=1
    this.isLiked=false
  }
  set like(like=false){
    this.isLiked = like;
  }
  get like(){
    return this.isLiked
  }

  set amount(amount){
    this._amount = amount;
  }
  get amount(){
    return this._amount
  }
}


  class BooksService{
    constructor(userService,cardComponent=null){
      this.cardsHTML = []
      this.catalog =new Map()
      this.cardComponent=cardComponent;
      this.userService=userService;
    }

     init(){
     document.body.appendChild(this.buildHeader());
     this.loadItems();
     document.body.appendChild(this.buidModalContainer());
    }

    async loadItems(){
      await fetch('./assets/books.json')
      .then(response => response.json())
      .then(booksJSON => {
        this.renderBooks(booksJSON);
      }).catch(err=>{
        console.log('Error: ',err);
      })
    }

     renderBooks(books){
        const mainFragment= document.createDocumentFragment();
        const main= this.cardComponent.createElement('main','main','',{id:"container"})
        const wrapper = this.cardComponent.createElement('div',' bd-grid cards_wrapper split left')
        books.forEach((book,index) => {
        const bookObj= new Book(book.isbn,book.title,book.description,book.author,book.imageLink,book.price)
        const card = this.cardComponent.buildCardElement(book)
        this.cardsHTML.push(card)
        wrapper.appendChild(card)
        this.catalog.set(book.isbn,bookObj)
      })
      main.appendChild(wrapper)
      mainFragment.append(main);   
      document.body.append(mainFragment);
    }

    buildHeader(){

      const createElements=(createElement)=>{
        const headerFragment = new DocumentFragment()
        const header = createElement('header')
        const header_container = createElement('div','header_container')
        const h1_title = createElement('h1','title-shop')
        const link_h1_title = createElement('a','','books shop',{"href":"./index.html"})
        const nav = createElement('nav','nav-panel')
        const user_info = createElement('div','user-info','',{ ondrop:"cardComponent.drop(event)",ondragover:"cardComponent.allowDrop(event)" })
        const cart_icon = createElement('a','card__icon','',{onclick:"bookService.showBookLists(this)"})
        const cart = createElement('div','cart')
        const cart_title = createElement('h2','cart-title','SHOPPING CART')
        const cart_content = createElement('div','cart-content')
        const cart_icon_close = createElement('div','cart-icon-close')
        return bindElementsTogether({header,header_container,h1_title,link_h1_title,nav,user_info,cart_icon,cart,cart_title,cart_content,cart_icon_close,headerFragment});
      }

      const bindElementsTogether=(headerElements)=>{
        headerElements.headerFragment.append(headerElements.header)
        headerElements.header.appendChild(headerElements.header_container) 
        headerElements.header_container.appendChild(headerElements.h1_title) 
        headerElements.header_container.appendChild(headerElements.nav) 
        headerElements.h1_title.appendChild(headerElements.link_h1_title) 
        headerElements.nav.appendChild(headerElements.user_info)
        headerElements.user_info.appendChild(headerElements.cart_icon)
        headerElements.user_info.appendChild(headerElements.cart)
        headerElements.cart.appendChild(headerElements.cart_title)
        headerElements.cart.appendChild(headerElements.cart_content)
        headerElements.cart.appendChild(headerElements.cart_icon_close)
        headerElements.cart_icon.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M21 4H2v2h2.3l3.28 9a3 3 0 0 0 2.82 2H19v-2h-8.6a1 1 0 0 1-.94-.66L9 13h9.28a2 2 0 0 0 1.92-1.45L22 5.27A1 1 0 0 0 21.27 4 .84.84 0 0 0 21 4zm-2.75 7h-10L6.43 6h13.24z"></path><circle cx="10.5" cy="19.5" r="1.5"></circle><circle cx="16.5" cy="19.5" r="1.5"></circle></svg><span class="cart_items">0</span>'
        headerElements.cart_icon_close.innerHTML='<svg  id="cart-close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>'
        return headerElements.headerFragment
      }

      return createElements(this.cardComponent.createElement);
    }


    updateData(id){
      document.querySelector('.cart_items').innerText=this.userService.orderList.size
    }
    
    buidModalContainer(){
      const popUpFragment = new DocumentFragment()
      const section = this.cardComponent.createElement('section','modal container','',{id:"popup"})
      const popup_content = this.cardComponent.createElement('div','popup_content')
      popUpFragment.append(section)
      section.append(popup_content)
      return popUpFragment;
    }
    
    showBookLists(el){
      const cart = document.querySelector('.cart')
      if(![...el.classList].includes('active')){
          el.classList.add('active')
          this.cardComponent.buildUserCart()
          cart.classList.add('active')
          const closeCart = document.querySelector('#cart-close')
          closeCart.addEventListener('click',()=>{
          cart.classList.remove('active')
          el.classList.remove('active')
        },false)
      }else{
        cart.classList.remove('active')
        el.classList.remove('active')
      }
    }
    fillPopUpContent(book){
      const popup_content =document.querySelector('.popup_content')
      const img = this.cardComponent.createElement('img','popup_img','',{src:book.imgUrl,alt:'book image'})
      const title=  this.cardComponent.createElement('h2','popup_title',book.title)
      const popup_authors=  this.cardComponent.createElement('h3','popup_authors',book.authors)
      const popup_description=  this.cardComponent.createElement('p','popup_description', book.description)
      const button_close=  this.cardComponent.createElement('button','','',{id:"close-reader",onclick:"closePopup()"})
      const btn_add=  this.cardComponent.createElement('button','btn','ADD TO CART')
      popup_content.appendChild(img)
      popup_content.appendChild(title)
      popup_content.appendChild(popup_authors)
      popup_content.appendChild(popup_description)
      popup_content.appendChild(button_close)
      popup_content.appendChild(btn_add)
      button_close.innerHTML='<div>Close</div><svg id="close-x" width="20px" height="20px" viewBox="0 0 20 20"><title>Close</title> <g stroke="#000" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Icon_Close"  stroke="#000"><g><g><g><line x1="1.16116524" y1="18.8388348" x2="18.8388348" y2="1.16116524" id="Stroke-1"></line><line x1="1.16116524" y1="1.16116524" x2="18.8388348" y2="18.8388348" id="Stroke-3"></line></g></g></g></g></g></svg>'
      btn_add.onclick=()=>{
        this.addBookToOrder(book);
        closePopup();
      }
    }
    addBookToOrder(book){
      this.userService.orderList.set(book.id,book)
      this.cardComponent.buildUserCart();
      this.updateData();
      const card = document.getElementById(book.id);
      card.querySelector('.card__icon').classList.add('active')
    }
  }
  
  class UserServise{
    constructor(){
      this.orderList = new Map();
      this.favouritsList=new Map();
      this.shop=null;
    }
    addBookToOrder(id){
      const book = this.shop.catalog.get(id)
      this.orderList.set(id,book)
    }
    removeBookfromOrder(id){
      this.orderList.delete(id)
    }
    
    setAmount(amount,id){
      const book = this.orderList.get(id)
      book.amount=amount;
    }
    getTotalSum(){
      return  [...this.orderList.values()].reduce((sum,book)=>sum+(Number(book.price)*book.amount),0)
    }
    getBookFromOrder(id){
      return this.orderList.get(id)
    }
  }

  class CardComponent{
    constructor(bookService,userServise){
      this.bookService=bookService
      this.userServise=userServise
    }
    buildCardElement(book){
      const card = this.createElement('article','card','',{'id':book.isbn})
      const card_container = this.createElement('div','card_container')
      const card_img = this.createElement('div','card__img','',{ 'draggable':'true',"ondragstart":`cardComponent.drag(event,'${book.isbn}')`});
      const card_info = this.createElement('div','card__precis card__preci--now');
      const img = this.createElement('img','','',{src:book.imageLink})
      const link_1 = this.createElement('a','card__icon','',{'data-id':book.isbn,'data-icon':'cart'});
      const card_price= this.createElement('div','card_price')
      const card_title=this.createElement('p','card_title',book.title+' (show more)',{ 'onclick':`openPopup("${book.isbn}");`});
      const card_authors=this.createElement('p','card_authors',book.author);
      const card_price_span= this.createElement('span','',"$ "+book.price)
    
      card_img.appendChild(img)
      link_1.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M21 4H2v2h2.3l3.28 9a3 3 0 0 0 2.82 2H19v-2h-8.6a1 1 0 0 1-.94-.66L9 13h9.28a2 2 0 0 0 1.92-1.45L22 5.27A1 1 0 0 0 21.27 4 .84.84 0 0 0 21 4zm-2.75 7h-10L6.43 6h13.24z"></path><circle cx="10.5" cy="19.5" r="1.5"></circle><circle cx="16.5" cy="19.5" r="1.5"></circle></svg>';
      card_info.appendChild(link_1)
      card_info.appendChild(card_price)
      card_price.appendChild(card_price_span)
      card.append(card_container)
      card_container.appendChild(card_img)
      card_container.appendChild(card_authors)
      card_container.appendChild(card_title)
      card_container.appendChild(card_info)
      link_1.onclick=(el)=>{
        const id = el.currentTarget.dataset.id
        this.userServise.addBookToOrder(id);
        this.buildUserCart()
        this.updateTotal()
        this.bookService.updateData(id)
        el.currentTarget.classList.add('active');
      }
     return card;
    }
    
    createElement(el,class_name="",text="",atrrs={}){
      const element= document.createElement(el)
      element.className=class_name;
      element.innerHTML=text
      for(let attr in atrrs){
        element.setAttribute(attr,atrrs[attr])
      }
      return element;
    }

  buildUserCart(){
    const cart_content = document.querySelector('.cart-content')
    cart_content.innerHTML = ""
    if([...this.userServise.orderList.values()].length){
      [...this.userServise.orderList.values()].forEach((book,i)=>{
        const box=this.createElement('div','cart-box');
        const detail_box=this.createElement('div','detail-box');
        const img=this.createElement('img','cart-img','',{src:book.imgUrl});
        const title=this.createElement('div','cart-product-title',book.title);
        const price=this.createElement('div','cart-price',`Price: $ ${book.price}`);
        const qty=this.createElement('div','cart-quantity');
        const plus = this.createElement('span','','&plus;');
        const minus = this.createElement('span','','&minus;');
        const input = this.createElement('input','','',{type:"number",min:"1",value:book.amount})
        const remBtn = this.createElement('span','cart-remove')
        const total = this.createElement('div','total-title','Your Total: ')
        const totalValue = this.createElement('b');
        const confirmDiv = this.createElement('div','btn-wrapper')
        const btnBuy = this.createElement('button','btn-buy','CONFIRM ORDER')
        remBtn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path></svg>'
        box.appendChild(img);
        box.appendChild(detail_box)
        detail_box.appendChild(title)
        detail_box.appendChild(price)
        detail_box.appendChild(qty)
        qty.appendChild(plus)
        qty.appendChild(input)
        qty.appendChild(minus)
        box.appendChild(remBtn)
        cart_content.appendChild(box);
        if(i==this.userServise.orderList.size-1){
          cart_content.appendChild(total);
          cart_content.appendChild(confirmDiv)
          total.appendChild(totalValue)
          confirmDiv.appendChild(btnBuy)
          this.updateTotal()
        }
        this.bindListeners({remBtn,plus,minus,input,detail_box,btnBuy},book.id)
      })
    }else{
        const empty_cart=this.createElement('div','empty-cart');
        const img=this.createElement('img','','',{src:"https://m.media-amazon.com/images/G/01/nav2/images/jetset/EmptyState_Space_IdeaLists._CB1533074461_.png", "height":"315"});
        const h2 = this.createElement('h2','empty-title',"There's so much space in here!")
        empty_cart.append(img);
        empty_cart.appendChild(h2)
        cart_content.append(empty_cart);
    }
   
  }

  bindListeners(elements,id){
    const book = this.userServise.getBookFromOrder(id)
    elements.remBtn.addEventListener('click',(e)=> {
      this.userServise.removeBookfromOrder(id); 
      this.buildUserCart()
      const card = document.getElementById(id);
      card.querySelector('.card__icon').classList.remove('active')
      this.bookService.updateData();
      this.updateTotal()
    },false)
    elements.plus.onclick=(e)=>{
      book.amount+=1; elements.input.value=(+elements.input.value)+1;
      this.updateTotal()
    }
    elements.minus.onclick=()=>{
      if(book.amount<=1) return false;
      book.amount-=1; elements.input.value=(+elements.input.value)-1;
      this.updateTotal()
    }
    elements.input.onchange=()=>{
      if((+elements.input.value)<1){elements.input.value = book.amount; return false;}
      book.amount=(+elements.input.value);
      this.updateTotal()
    }
    elements.btnBuy.onclick=()=>{
      this.createOrder()
      window.location.assign("./delivery-form.html");
    }
  }
  allowDrop(ev) {
    ev.preventDefault();
  }
  drag(ev,id) {
    ev.dataTransfer.setData("id", id);
  }
  drop(ev) {
    ev.preventDefault();
    var id = ev.dataTransfer.getData("id");
    this.bookService.addBookToOrder(bookService.catalog.get(id))
  }
                        
    updateTotal(){
      const cart_total_sum =document.querySelector('.total-title').children[0]
      cart_total_sum.innerText=' $'+this.userServise.getTotalSum();
    }
    removeBookfromOrder(id){
      this.userServise.removeBookfromOrder(id)
      this.updateTotal()
    }
    createOrder(){
      const order = { orderList:Object.fromEntries(this.userServise.orderList),totalSum:this.userServise.getTotalSum() }
      localStorage.setItem('order',JSON.stringify(order))
    }
  }
  
  const userServise = new UserServise()
  const bookService = new BooksService(userServise)
  userServise.shop= bookService
  const cardComponent=new CardComponent(bookService,userServise);
  bookService.cardComponent=cardComponent;
  window.onload=()=>{
    bookService.init();
  }
 
  function openPopup(index){
    let popup=document.getElementById('popup');
    popup.classList.add('popup_open')
    popup.children[0].classList.add('popup_open')
    bookService.fillPopUpContent(bookService.catalog.get(index))
  }
 function closePopup(){
   let popup=document.getElementById('popup');
    popup.classList.remove('popup_open')
    popup.children[0].classList.remove('popup_open')
    document.querySelector('.popup_content').innerHTML=""
  }
