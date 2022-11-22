class DeliveryForm{
    constructor(validator){
        const form = document.querySelector('form')
        const submitBtn=document.querySelector('form input[type=submit]')
        const summaryDetails=document.querySelector('.summary')
        const name  =document.querySelector('.user_details:nth-child(1) .input-box:nth-child(1) input')
        const surname = document.querySelector('.user_details:nth-child(1) .input-box:nth-child(2) input')
        const deliveryDate =  document.querySelector('input.datepicker-input')
        const dateTextInput =  document.querySelector('form .date-input-text')
        const street = document.querySelector('.user_details:nth-child(3) .input-box:nth-child(1) input')
        const house = document.querySelector('.user_details:nth-child(3) .input-box:nth-child(2) input')
        const flat = document.querySelector('.user_details:nth-child(3) .input-box:nth-child(3) input')
        const payment = document.querySelectorAll('.choose-box input[type=radio]')
        const paymentTitle = document.querySelector('form .user_details .payment-title')
        const gifts =  document.querySelectorAll('.options input[type=checkbox]')
        this.validator = validator;
        this.formElements={name, surname,deliveryDate,dateTextInput, street, house, flat, payment, gifts,submitBtn,paymentTitle,summaryDetails,form}
        Validator.invalidElements=new Set([name, surname,dateTextInput, street, house, flat, paymentTitle])
        this.buildListeners()
        this. setAttributes(deliveryDate);
        this.initDataInCart()
    }

    buildListeners(){
        this.formElements.name.addEventListener('focusout',(e)=>{ this.validator.checkName( this.formElements.name)})
        this.formElements.name.addEventListener('keyup',(e)=>{ this.validator.checkName( this.formElements.name)})
        this.formElements.surname.addEventListener('focusout',(e)=>{ this.validator.checkSurname(this.formElements.surname)})
        this.formElements.surname.addEventListener('keyup',(e)=>{ this.validator.checkSurname(this.formElements.surname)})
        this.formElements.deliveryDate.addEventListener('change',(e)=>{ this.validator.checkDeliveryDate(this.formElements.deliveryDate)})
        this.formElements.dateTextInput.addEventListener('focusout',(e)=>{ this.validator.checkDeliveryDateText(this.formElements.dateTextInput)})
        this.formElements.dateTextInput.addEventListener('keyup',(e)=>{ this.validator.checkDeliveryDateText(this.formElements.dateTextInput)})
        this.formElements.street.addEventListener('focusout',(e)=>{ this.validator.checkStreet(this.formElements.street)})
        this.formElements.street.addEventListener('keyup',(e)=>{ this.validator.checkStreet(this.formElements.street)})
        this.formElements.house.addEventListener('focusout',(e)=>{ this.validator.checkHouse(this.formElements.house)})
        this.formElements.house.addEventListener('keyup',(e)=>{ this.validator.checkHouse(this.formElements.house)})
        this.formElements.flat.addEventListener('focusout',(e)=>{ this.validator.checkFlat(this.formElements.flat)})
        this.formElements.flat.addEventListener('keyup',(e)=>{ this.validator.checkFlat(this.formElements.flat)})
        this.formElements.payment.forEach(radio=>radio.addEventListener('change',(e)=>{this.validator.checkPayment(this.formElements.paymentTitle)},false))
        this.formElements.gifts.forEach(box=>box.addEventListener('change',(e)=>{this.validator.checkGiftsAmount(e,this.formElements.gifts)},false))
        this.formElements.submitBtn.addEventListener('onsubmit',(e)=>{ this.onSubmit()})
    }

    setAttributes(deliveryDate){
        const minDeliveryDate = new Date()
        minDeliveryDate.setDate(minDeliveryDate.getDate() + 1)
        deliveryDate.setAttribute("min",`${minDeliveryDate.getFullYear()}-${minDeliveryDate.getMonth()+1}-${minDeliveryDate.getDate()}`)
    }
    onSubmit(){
        this.validator.isValid(this.formElements) && this.biuldSummaryReport()
        return false;
    }
    initDataInCart(){
      const cartItemsQty = document.querySelector('.cart_items')
      cartItemsQty.textContent = Object.keys(JSON.parse(localStorage.getItem('order')).orderList).length
    }
    biuldSummaryReport(){
      const formData = new FormData(this.formElements.form);
       const order = JSON.parse(localStorage.getItem('order'));
        order.name= formData.get('name')
        order.surname= formData.get('surname')
        order.deliveryDate= formData.get('deliveryDate')
        order.deliverAdress =formData.get('street')+' '+formData.get('houseNumber')+' / '+formData.get('flatNumber')
        const gifts= [ ...formData.keys()].filter(key=>{  return /^gift-/.test(key)}).map(i=>formData.get(i)).join(', ')
        const orderListHtml=Object.values(order.orderList).map(item=>{
          return `
            <div class="user_details">
                <div class="input-box head">
                    <p class="details">${item.id}</p>
                    <p class="details">${item.title}</p>
                    <p class="details">${item.price}$</p>
                    <p class="details">${item._amount} </p>
                    <p class="details">${+item._amount * (+item.price)}$</p>
                </div>
              </div>
          `
        }).join('');
      this.formElements.summaryDetails.innerHTML=`
          <div class="title">Order Summary Report</div>
                <div class="user_details">
                    <div class="input-box">
                        <p class="details">${order.name}  ${order.surname}</p>
                        <p class="details"><b>Delivery adress:</b> ${order.deliverAdress}</p>
                    </div>
                    <div class="input-box">
                        <p class="details"><b>Delivery date:</b> ${order.deliveryDate}</p>
                        <p class="details"><b>Amount paid:</b> ${order.totalSum}$</p>
                  </div>
                  <div class="input-box">
                        <p class="details"><b>Payment type:</b> ${formData.get('payment')}</p>
                        <p class="details"><b>Gifts:</b> ${gifts}</p>
                  </div>
                </div>
                <div class="title"></div>
                <div class="user_details">
                  <div class="input-box head">
                      <p class="details"><b>Item ID</b></p>
                      <p class="details"><b>Title</b></p>
                      <p class="details"><b>Price</b></p>
                      <p class="details"><b>Qty</b></p>
                      <p class="details"><b>Ext.Price</b></p>
                  </div>
                </div>
                ${orderListHtml}
                <p class="details"><b>Amount paid:</b> ${order.totalSum}$</p>

                <div class="button">
                    <input type="button" value="CLOSE" onclick='DeliveryForm.goHomePage();' >
                </div>
          `
          order.orderList={}
          order.totalSum=0
          localStorage.setItem('order',JSON.stringify(order))
          this.initDataInCart()
          this.formElements.form.parentElement.classList.add('hide');
          this.formElements.summaryDetails.classList.remove('hide');
   }
   static goHomePage(){
      window.location.assign("./index.html");
   }
    static canSubmit(fomIsValid){
      const btn = document.querySelector('form input[type=submit]');
      fomIsValid ? btn.removeAttribute("disabled") : btn.setAttribute("disabled","true")
    }
    
 }
 class Validator {
    static invalidElements
    static errors={
      currentErrors:new Set(),
      textMsgs:{
        name:"Name (mandatory, the length not less than 4 symbols, strings only, without spaces)",
        surname:"Surname (mandatory, the length not less than 5 symbols, strings only, without spaces)",
        deliveryDate:"Delivery date (mandatory, not earlier than next day)",
        street:" Street (mandatory, the length not less than 5 symbols, the numbers are allowed)",
        house:"House number(mandatory, numbers only, positive numbers only)",
        flat:"Flat number(mandatory, numbers only, positive numbers only, the dash symbol is allowed. Means, the flat number shouldn't start with minus/dash symbol. For example: -37 is invalid, but 1-37 is valid)",
        payment:"Choose the payment type(radio buttons group): Cash or Card (mandatory)"
      },
      removeError(error,element){
        this.currentErrors.has(error) && this.currentErrors.delete(error)
        Validator.invalidElements.has(element) && Validator.invalidElements.delete(element)
      },
      addError(error,element){
        this.currentErrors.add(error)
        Validator.invalidElements.add(element)
      },
      hasErrors(){
        DeliveryForm.canSubmit(!Validator.invalidElements.size)
      },
    }

   constructor() {
     this.dilogElement = document.querySelector('.form-errors')
   }
   isValid(formElements) {
        return this.checkName(formElements.name)
          .checkSurname(formElements.surname)
          .checkDeliveryDate(formElements.deliveryDate)
          .checkStreet(formElements.street)
          .checkHouse(formElements.house)
          .checkFlat(formElements.flat)
          .checkPayment(formElements.paymentTitle)
          .summary();
   }
   clearClassList(el, classList=[]){
    classList.forEach(className=>{
      el.classList.contains(className) && el.classList.remove(className)
    })
   }
   checkResult(result, element,error){
    if(result){
      element.classList.add('valid') 
      Validator.errors.removeError(error,element)
    } 
    else {
      element.classList.add('invalid')
      Validator.errors.addError(error,element)
    }
    Validator.errors.hasErrors();
   }
   checkName = (element) => {
      const result =/^[a-zA-Z]{4,}$/.test(element.value);
      this.clearClassList(element,['valid','invalid'])
      this.checkResult(result,element,Validator.errors.textMsgs.name)
      this.showErrors();
      return this;
   };
   checkSurname = (element) => {
      const result =/^[a-zA-Z]{5,}$/.test(element.value);
      this.clearClassList(element,['valid','invalid'])
      this.checkResult(result,element,Validator.errors.textMsgs.surname)
      this.showErrors();
      return this;
   };
   
   checkDeliveryDate = (element) => {
        const value = element.value;
        const regex = new RegExp("(0[1-9]|(1[0-9])|2[0-9]|3[0,1])-(0[1-9]|1[0-2])-([0-9]{4})");
        const dateStr= value.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/,"$3-$2-$1")
        const deliveryDate = new Date(value);
        const result =( regex.test(dateStr) && deliveryDate.getTime() > new Date().getTime() )
        const element2=document.querySelector('form .date-input-text')
        result? element2.value=dateStr : element2.value='';
        this.clearClassList(element2,['valid','invalid'])
        this.checkResult(result,element2,Validator.errors.textMsgs.deliveryDate)
        this.showErrors();
        return this;
   };

   checkDeliveryDateText=(element)=>{
        const value =element.value
        const regex = new RegExp("(0[1-9]|(1[0-9])|2[0-9]|3[0,1])-(0[1-9]|1[0-2])-([0-9]{4})");
        const dateStr= value.replace(/(\d{1,2})\W(\d{1,2})\W(\d{4})/,"$3-$2-$1")
        const deliveryDate = new Date(dateStr);
        const result =( regex.test(value) && deliveryDate.getTime() > new Date().getTime() )
        if(result) document.querySelector('input.datepicker-input').value = dateStr 
        this.clearClassList(element,['valid','invalid'])
        this.checkResult(result,element,Validator.errors.textMsgs.deliveryDate)
        this.showErrors();
        return this;
   }

   checkStreet = (element) => {
      const result = /^([a-zA-Z0-9]+( [a-zA-Z0-9]*)*){5,}$/.test(element.value);
      this.clearClassList(element,['valid','invalid'])
      this.checkResult(result,element,Validator.errors.textMsgs.street)
      this.showErrors();
      return this;
   };

   checkHouse = (element) => {
      const result = /^[1-9]{1,}$/.test(element.value);
      this.clearClassList(element,['valid','invalid'])
      this.checkResult(result,element,Validator.errors.textMsgs.house)
      this.showErrors();
      return this;
   };

   checkFlat = (element) => {
      const result = /^[1-9]{1,}(\W\d{1,})?$/.test(element.value);
      this.clearClassList(element,['valid','invalid'])
      this.checkResult(result,element,Validator.errors.textMsgs.flat)
      this.showErrors();
      return this;
   };

   checkPayment = (element) => {
      const radio_btn= document.querySelector('input[name=payment]:checked')
      this.clearClassList(element,['valid','invalid'])
      this.checkResult(!!radio_btn,element,Validator.errors.textMsgs.payment)
      this.showErrors();
      return this;
   };

   checkGiftsAmount = (e, checkboxes) => {
     const el = e.currentTarget;
     let quantityChecked = 0;
     checkboxes.forEach((element) => {
       element.checked && quantityChecked++;
     });
     if (el.checked) {
       quantityChecked > 2 ? (el.checked = false) : (el.checked = true);
     }
   };

   showErrors(){
    this.dilogElement.innerHTML="";
    for (const err of Validator.errors.currentErrors) {
      const textEl = document.createElement('p')
        textEl.textContent = err; 
        this.dilogElement.appendChild(textEl)
    }
   }

   summary(){
      if(Validator.errors.hasErrors()){
        this.showErrors()
        return false;
      }
      return true;
   }
}
 const form=new DeliveryForm(new Validator());
