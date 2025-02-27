// Класс CreateTransactionForm управляет формой создания новой транзакции

class CreateTransactionForm extends AsyncForm {

  // Вызывает родительский конструктор и метод renderAccountsList
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  // Получает список счетов с помощью Account.list. Обновляет в форме всплывающего окна выпадающий список
  renderAccountsList() {

    Account.list(User.current(), (error, response) => {
      this.element.querySelector('.accounts-select').textContent = '';
      if (response.success) {
        response.data.forEach((item) => {
          this.element.querySelector('.accounts-select').insertAdjacentHTML('beforeEnd', `<option value="${item.id}">${item.name}</option>`);
        });
      }
    });
  }

  // Создаёт новую транзакцию (доход или расход) с помощью Transaction.create. По успешному результату вызывает App.update(),
  // сбрасывает форму и закрывает окно, в котором находится форма
  onSubmit(data) {
    Transaction.create(data, (error, response) => {
      if (response.success) {
        console.log(data);
        App.modals[`new${data.type[0].toUpperCase() + data.type.substring(1)}`].close();
        App.update();
      }
    });
  }
}