// Класс AsyncForm управляет всеми формами приложения, которые не должны быть отправлены с перезагрузкой страницы.
// Вместо этого данные с таких форм собираются и передаются в метод onSubmit для последующей обработки

class AsyncForm {
  // Если переданный элемент не существует, необходимо выкинуть ошибку. Сохраняет переданный элемент и регистрирует события через registerEvents()
  constructor(element) {
    if (element === undefined) {
      throw new Error('Переданный элемент не существует');
    }
    this.element = element;
    this.registerEvents();
  }

  // Необходимо запретить отправку формы и в момент отправки вызывает метод submit()
  registerEvents() {
    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      try {
        this.submit();
      } catch (error) {
        throw new Error(error);
      }
    });
  }

  // Преобразует данные формы в объект вида { 'название поля формы 1': 'значение поля формы 1', 'название поля формы 2': 'значение поля формы 2' }
  getData() {
    let formData = new FormData(this.element);
    let entries = formData.entries();
    let object = {};

    for (let item of entries) {
      object[item[0]] = item[1];
    }

    return object;
  }

  onSubmit(options){
    
  }

  // Вызывает метод onSubmit и передаёт туда данные, полученные из метода getData()
  submit() {
    this.onSubmit(this.getData());
  }
}