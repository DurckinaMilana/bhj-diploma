// Класс TransactionsPage управляет страницей отображения доходов и расходов конкретного счёта

class TransactionsPage {

  // Если переданный элемент не существует, необходимо выкинуть ошибку. Сохраняет переданный элемент и регистрирует события через registerEvents()
  constructor( element ) {
    if (element === undefined) {
      throw new Error('Переданный элемент не существует');
    }
    this.element = element;
    this.registerEvents();
  }

  // Вызывает метод render для отрисовки страницы
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
    } else {
      this.render();
    }
  }

  // Отслеживает нажатие на кнопку удаления транзакции и удаления самого счёта. Внутри обработчика пользуйтесь
  // методами TransactionsPage.removeTransaction и TransactionsPage.removeAccount соответственно
  registerEvents() {
    this.element.querySelector('.remove-account').addEventListener('click', (e) => {
      e.preventDefault();
      this.removeAccount();
    });

    this.element.querySelector('.content').addEventListener('click', (e) => {
      e.preventDefault();
      this.removeTransaction(e.target.closest('.transaction__remove').dataset.id);
    });
  }

  // Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm()).
  // Если пользователь согласен удалить счёт, вызовите Account.remove, а также TransactionsPage.clear с пустыми данными для того, чтобы очистить страницу.
  // По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(), либо обновляйте только виджет со счетами и формы создания дохода и расхода для обновления приложения
  removeAccount() {
    if (!this.lastOptions) {
      return;
    }
    let isRemoveAccount = confirm('Вы действительно хотите удалить счёт?');

    if (isRemoveAccount) {
      Account.remove(this.lastOptions.account_id, (error, response) => {
        if (response.success) {
          App.updateWidgets();
          App.updateForms();
        }
      });
      this.clear();
    }
  }

  // Удаляет транзакцию (доход или расход). Требует подтверждеия действия (с помощью confirm()).
  // По удалению транзакции вызовите метод App.update(), либо обновляйте текущую страницу (метод update) и виджет со счетами
  removeTransaction( id ) {
    let isRemoveTrans = confirm('Вы действительно хотите удалить эту транзакцию?');

    if (isRemoveTrans) {
      Transaction.remove(id, (error, response) => {
        if (response.success) {
          App.update();
        }
      });
    }
  }

  // С помощью Account.get() получает название счёта и отображает его через TransactionsPage.renderTitle.
  // Получает список Transaction.list и полученные данные передаёт в TransactionsPage.renderTransactions()
  render(options){
    this.lastOptions = options;

    if (!this.lastOptions) {
      return;
    }

    Account.get(this.lastOptions.account_id, (error, response) => {
      if (response.success) {
        this.renderTitle(response.data.name);
      }
    });

    Transaction.list(this.lastOptions, (error, response) => {
      if (response.success) {
        this.renderTransactions(response.data);
      }
    });
  }

  // Очищает страницу. Вызывает TransactionsPage.renderTransactions() с пустым массивом. Устанавливает заголовок: «Название счёта»
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = '';
  }

  // Устанавливает заголовок в элемент .content-title 
  renderTitle(name){
    this.element.querySelector('.content-title').textContent = name;
  }

  // Форматирует дату в формате 2019-03-10 03:20:41 (строка) в формат «10 марта 2019 г. в 03:20»
  formatDate(date){
    let year = date.substring(0, 4);
    let month = Number(date.substring(5, 7));
    let day = Number(date.substring(8, 10));
    let hour = date.substring(11, 13);
    let minutes = date.substring(14, 16);
    let arrMonths = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    return `${day} ${arrMonths[month - 1]} ${year} г. в ${hour}:${minutes}`;
  }

  // Формирует HTML-код транзакции (дохода или расхода). item - объект с информацией о транзакции
  getTransactionHTML(item){
    let formatedDate = this.formatDate(item.created_at);

    let transactionHTML = `
      <div class="transaction transaction_${item.type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <div class="transaction__date">${formatedDate}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
            ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id=${item.id}>
            <i class="fa fa-trash"></i>  
          </button>
        </div>
      </div>
    `;

    return transactionHTML;
  }

  // Отрисовывает список транзакций на странице используя getTransactionHTML
  renderTransactions(data) {
    this.element.querySelector('.content').textContent = '';
    data.forEach( (item) => this.element.querySelector('.content').insertAdjacentHTML( 'beforeEnd', this.getTransactionHTML(item) ) );
  }
}