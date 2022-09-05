let cart = [];
let sum = 0;

betoltes();

function betoltes() {
    const cartElem = document.getElementById('cart');
    const sumElem = document.getElementById('osszesen');

    cart = JSON.parse(sessionStorage.cartItems);
    sum = 0;
    cart.forEach(c => {
        cartElem.innerHTML +=
            '<div class="py-2 border-top border-secondary text-center">' +
                '<div class="my-auto text-warning">' + c.name + '</div>' +
                '<div class="my-auto">' + c.quantity + ' x ' + c.price + ' Ft</div>' +
                '<div class="my-auto text-info">' + (c.quantity * c.price) + ' Ft</div>' +
            '</div>';
        sum += c.quantity * c.price;
        sumElem.innerHTML = '<h6 class="text-info p-3">Fizetendő: ' + sum + ' Ft</h6>';
    });
};

const form = document.getElementById('form');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let mobile = document.getElementById('mobile').value;
    let address = document.getElementById('address').value;
    let city = document.getElementById('city').value;
    let postcode = document.getElementById('postcode').value;
    let country = document.getElementById('country').value;
    let message = document.getElementById('message').value;
    
    sendOrder(name, email, mobile, address, city, postcode, country, message);
})

function sendOrder(name, email, mobile, address, city, postcode, country, message) {
    const url= 'http://localhost:3000/order';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            "name": name,
            "address": address,
            "city": city,
            "postcode": postcode,
            "country": country,
            "mobile": mobile,
            "email": email,
            "createdAt": getCurrentDateTime(),
            "total": sum,
            "messageFromUser": message,
            "orderedItems": cart
        })
    })
        .then((response) => response.json())
        .then(json => saveOrderItemsToDB(json.insertId))
        .then(() => {
            alert('Köszönjük!');
            sessionStorage.removeItem('cartItems');
        })
        .then(() => window.open('order.html', '_self'))
        .catch(err => {
            console.log(err);
            alert('Hiba történt!');
        });
}

function saveOrderItemsToDB(orderId) {
    const url= 'http://localhost:3000/orderitems';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            "orderId": orderId,
            "orderedItems": cart
        })
    })
        .then((response) => response.json())
        .then(json => console.log(json))
        .catch(err => {
            console.log(err);
            alert('Hiba történt2!');
        });
}

function getCurrentDateTime() {
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;
    return dateTime;
}