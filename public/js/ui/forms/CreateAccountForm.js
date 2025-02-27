// Класс CreateAccountForm управляет формой создания нового счёта

class CreateAccountForm extends AsyncForm {

  // Создаёт счёт с помощью Account.create и закрывает окно в случае успеха, а также вызывает App.update() и сбрасывает форму
  onSubmit(data) {
    Account.create(data, (error, response) => {
      if (response.success) {
        App.modals.createAccount.close();
        App.update();
      }
    });
  }
}