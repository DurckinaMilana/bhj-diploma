// Класс Sidebar отвечает за работу боковой колонки: кнопки скрытия/показа колонки в мобильной версии сайта и за кнопки меню

class Sidebar {

  // Запускает initAuthLinks и initToggleButton
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  // Отвечает за скрытие/показа боковой колонки: переключает два класса для body: sidebar-open и sidebar-collapse при нажатии на кнопку .sidebar-toggle
  static initToggleButton() {
    document.querySelector('.sidebar-toggle').addEventListener('click', () => {
      let sidebarMini = document.querySelector('.sidebar-mini');
      sidebarMini.classList.toggle('sidebar-open');
      sidebarMini.classList.toggle('sidebar-collapse');
    });
  }

  static initAuthLinks() {
    // При нажатии на кнопку регистрации показывает окно регистрации.
    document.querySelector('.menu-item_register').addEventListener('click', (e) => {
      e.preventDefault();
      App.getModal('register').open();
    });

    // При нажатии на кнопку входа, показывает окно входа (через найденное в App.getModal).
    document.querySelector('.menu-item_login').addEventListener('click', (e) => {
      e.preventDefault();
      App.getModal('login').open();
    });

    // При нажатии на кнопку выхода вызывает User.logout и по успешному выходу устанавливает App.setState( 'init' )
    document.querySelector('.menu-item_logout').addEventListener('click', (e) => {
      e.preventDefault();
      User.logout((error, response) => {
        if (response.success) {
          App.setState('init');
        }
      });
    });
  }
}