/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if(element == ''){
      throw new Error ('element undefined');
    }
    this.element = element;
    this.registerEvents();
    this.lastOptions = {};
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (event) => {
      let e = event.target;
      if(e.className.includes('remove-account')){
        this.removeAccount();
      }
      if(e.className.includes('transaction__remove')){
        this.removeTransaction(e.dataset.id);
      }
       if(e.parentElement.className.includes('transaction__remove')){
        this.removeTransaction(e.parentElement.dataset.id);
      }
    })
    
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if(this.lastOptions == undefined){
      return false;
    }
    let answer = confirm('Вы действительно хотите удалить счёт?');
    if(answer){
      let form = new FormData();
      form.append('id', this.lastOptions.account_id);
      Account.remove(form, (err, response)=>{
        if(response.success && response){
          App.updateWidgets();
          App.updateForms();
        }else{
          err = new Error('Не удалось удалить счет');
        }
      })
      this.clear();
    }
    
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    let answer = confirm('Вы действительно хотите удалить эту транзакцию?');
    if(answer){
      let form = new FormData();
      form.append('id', id)
      Transaction.remove(form, (err, response)=>{
        if(response && response.success){
          App.update();
        }else{
          err = new Error('Не удалось удалить транзакцию');
        }
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    this.element.querySelector('.content').innerHTML = '';
    if (Object.keys(options).length == 0) {
      return false;
    } else {
      Account.get(options.account_id, (err,response) => {
        if (response.success && response) {
          this.renderTitle(response.data.name);
        }else {
          err = new Error ('Не удалось открыть счёт');
        }
      })
      this.lastOptions = options;
      Transaction.list(options.account_id, (err,response) => {
        if(response.success && response){
          this.renderTransactions(response.data)
        }
      })
    }
  }

  /** Очищает страницу. Вызывает TransactionsPage.renderTransactions() с пустым массивом. Устанавливает заголовок: «Название счёта» **/
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = {};
  }

  /** Устанавливает заголовок в элемент .content-title **/
  renderTitle(name){
    let title = document.querySelector('.content-title');
    title.textContent = name;
  }

  /** Форматирует дату в формате 2019-03-10 03:20:41 (строка) в формат «10 марта 2019 г. в 03:20» **/
  formatDate(date){
    let d = new Date(date).toLocaleString('ru', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    let t = new Date(date).toLocaleTimeString('ru', {
      hour: "2-digit",
      minute: "2-digit"
    });
    return d + ' в ' + t;
  }

  /** Формирует HTML-код транзакции (дохода или расхода). item - объект с информацией о транзакции **/
  getTransactionHTML(item){
    let date = this.formatDate(item.created_at);
    
    return `<div class="transaction transaction_${item.type} row">
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
        </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${date}</div>
      </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
          ${item.sum}<span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id=${item.id}>
            <i class="fa fa-trash"></i>  
        </button>
      </div>
    </div>`
  }

  /** Отрисовывает список транзакций на странице используя getTransactionHTML **/
  renderTransactions(data){
   let content =  this.element.querySelector('.content');
   if(data.length === 0){
    content.innerHTML = '';
   }
   for (let item in data){
    content.innerHTML += this.getTransactionHTML(data[item]);
   }
  }
}