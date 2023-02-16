class Account extends Entity {
  static URL = '/account';

  // Получает информацию о счёте
  static get(id, callback){
    createRequest({
      url: this.URL + `/${id}`,
      data: id,
      method: 'GET',
      callback: (error, response) => {
        if (!response.success) {
          console.log(response.error);
        }
        callback(error, response);
      },
    });
  }
}
