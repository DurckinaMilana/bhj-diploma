// Основная функция для совершения запросов на сервер

const createRequest = (options) => {
    const xhr = new XMLHttpRequest(); // создаем инстанс XMLHttpRequest

    // пытаемся отправить запрос, если не получается перехватываем ошибку
    try {

        // в зависимости от параметра method инициализируем и отправляем запрос на сервер в соответствующем виде
        if (options.method === 'GET') {
            let xhrURL = '';

            for (let key in options.data) {
                xhrURL += '&' + key + '=' + options.data[key];
            }
            
            xhr.open(options.method, options.url + '?' + xhrURL.substring(1));
            xhr.send();
        } else {
            const formData = new FormData;

            for (let key in options.data) {
                formData.append(key, options.data[key]);
            }
            
            xhr.open(options.method, options.url);
            xhr.send(formData);
        }
    } catch (error) {
        options.callback(error);
    }
    xhr.responseType = 'json'; // все ответы с сервера должны приходить в формате json

    // когда запрос завершен, выполняем функцию callback
    xhr.onload = () => options.callback(xhr.response.error, xhr.response);
};