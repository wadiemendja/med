// clearing cookies
document.cookie = '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

const items = document.querySelectorAll('.item');

items.forEach((element) => {
    element.addEventListener('click', (event) => {
        // getting data type admin / student / teacher
        const dataType = event.target.dataset;
        const url = new URL(location.href + "login");
        url.searchParams.append('type', dataType.type);
        location.href = url;
    });
});