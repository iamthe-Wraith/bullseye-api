# bullseye-api
a simple api sandbox

## API
| endpoint | desc  | link  |
|:---------|:------|:-----:|
|`POST /auth` | sign in | [show info](#post-auth)
|`POST /api/users` | create user | [show info](#post-apiusers) | 
|`GET /api/users` | get multiple users | [show info](#get-apiusers) | 
|`GET /api/users/:username` | get single user | [show info](#get-apiusersusername) | 
|`PATCH /api/users/:username` | update user | [show info](#put-apiusersusername) | 
|`DELETE /api/users/:username` | delete user | [show info](#delete-apiusersusername)    | 
|`POST /api/products` | create product | [show info](#post-apiproducts) |
|`GET /api/products` | get multiple products | [show info](#get-apiproducts) |
|`GET /api/products/:id` | get single product | [show info](#get-apiproductsid) |
|`PATCH /api/products/:id` | update product | [show info](#put-apiproductsid) |
|`DELETE /api/products/:id` | delete product | [show info](#delete-apiproductsid) |

## Authentication
Retrieving products does not require authentication. All other endpoints require the user to be authenticated. To authenticate, see [`POST /auth`](#post-auth).

Once you have successfully signed in and have retrieved your token, you will need to ensure all subsequent calls to the API includes your token in the `Authorization` header.

__IMPORTANT__ - tokens are currently implemented to expire after 1 hour. 

-----

for the following examples, we will work as though we are going to use the `BullsEyeAPI` axios instance, assuming that the auth token has been stored in local storage as descibed in [__Authentication__](#authentication).



## `POST /auth`
authenticates a user

__Auth Required:__ NO

### Success Response

__Status Code__ `200 OK`

__Code example__
```javascript
import BullEyeAPI from '.../bullseye';

BullsEyeAPI.post('/auth', {
  username: 'testUser1',
  password: 'password'
})
  .then(response => {
    console.log(response.headers.authorization); // the token
  });
```



## `POST /api/users`
creates a new user

__Auth Required:__ YES - at least admin permissions required

### Success Response

__Status Code__ `200 OK`

__Code example__
```javascript
import BullEyeAPI from '.../bullseye';

BullsEyeAPI.post('/api/users', {
  username: 'testUser2',
  email: 'testuser2@bullseye.com',
  password: 'password'
})
  .then(response => {
    console.log(response.data);
  });
```

__Example Response__
```javascript
{
  user: {
    username: "testUser2",
    email: "testuser2@bullseye.com",
    permissions: "member"
  }
}
```



## `GET /api/users`
retrieves multiple users

__Auth Required:__ NO

__query parameters__
| name | description |
|-----:|:------------|
| `username` | queries all user usernames for this substring |
| `email` | queries all user emails for this substring |
| `page` | used with pagination. specifies what page to retrieve |
| `numUsers` | specifies the max number of users to retrieve |

### Success Response

__Status Code__ `200 OK`

__Code example__
```javascript
import BullEyeAPI from '.../bullseye';

const query = {
  username: 'testUser',
  numUsers: 10
};

BullsEyeAPI.get('/api/users', query)
  .then(response => {
    console.log(response.data);
  });
```

__Example Response__
```javascript
{
  count: 78,
  users: [
    {username: "testUser1", email: "testuser1@bullseye.com", permissions: "member"},
    {username: "testUser10", email: "testuser5@bullseye.com", permissions: "member"},
    {username: "testUser2", email: "testuser2@bullseye.com", permissions: "member"},
    {username: "testUser3", email: "testuser3@bullseye.com", permissions: "member"},
    {username: "testUser4", email: "testuser4@bullseye.com", permissions: "member"},
    {username: "testUser5", email: "testuser5@bullseye.com", permissions: "member"},
    {username: "testUser6", email: "testuser1@bullseye.com", permissions: "member"},
    {username: "testUser7", email: "testuser2@bullseye.com", permissions: "member"},
    {username: "testUser8", email: "testuser3@bullseye.com", permissions: "member"},
    {username: "testUser9", email: "testuser4@bullseye.com", permissions: "member"}
  ]
}
```



## `GET /api/users/:username`
retrieves a single user

`:username` - the current username of the user being retrieved

__Auth Required:__ NO

### Success Response

__Status Code__ `200 OK`

__Code example__
```javascript
import BullEyeAPI from '.../bullseye';

BullsEyeAPI.get('/api/users/testUser1')
  .then(response => {
    console.log(response.data);
  });
```

__Example Response__
```javascript
{
  user: {
    username: "testUser1",
    email: "testuser1@bullseye.com",
    permissions: "member"
  }
}
```



## `PATCH /api/users/:username`
updates a users data

`:username` - the current username of the user being updated

__Auth Required:__ YES - at least admin permissions required

### Success Response

__Status Code__ `200 OK`

__Code example__
```javascript
import BullEyeAPI from '.../bullseye';

BullsEyeAPI.patch('/api/users/testUser2', {
  email: 'testuser2updated@bullseye.com'
})
  .then(response => {
    console.log(response.data);
  });
```

__Example Response__
```javascript
{
  user: {
    username: "testUser2",
    email: "testuser2updated@bullseye.com",
    permissions: "member"
  }
}
```



## `DELETE /api/users/:username`
deletes a user

`:username` - the current username of the user being deleted

__Auth Required:__ YES - at least admin permissions required

### Success Response

__Status Code__ `200 OK`

__Code example__
```javascript
import BullEyeAPI from '.../bullseye';

BullsEyeAPI.delete('/api/users/testUser2')
  .then(response => {
    console.log(response.data);
  });
```

__Example Response__
```javascript
{}
```



## `POST /api/products`
creates a new product

__Auth Required:__ YES - at least admin permissions required

### Success Response

__Status Code__ `200 OK`

__Code example__
```javascript
import BullEyeAPI from '.../bullseye';

BullsEyeAPI.post('/api/products', {
  name: 'Red Hoody',
  price: 59.99,
  category: 'clothing',
  image: 'http://lorempixel.com/640/480'
})
  .then(response => {
    console.log(response.data);
  });
```

__Example Response__
```javascript
{
  product: {
    category: "clothing"
    id: "5eaae480a85db90017f66a66"
    image: "http://lorempixel.com/640/480"
    name: "Red Hoody"
    price: 59.99
  }
}
```


## `GET /api/products`
retrieves multiple products

__Auth Required:__ NO

__query parameters__
| name | description |
|-----:|:------------|
| `name` | queries all product names for this substring |
| `category` | queries all product categories for this substring |
| `minPrice` | queries all products with price that is equal to or greater than this price |
| `maxPrice` | queries all products with price that is equal to or less than this price |
| `price` | queries all products that match this price (if `minPrice` or `maxPrice` are provided, this param will be ignored) |
| `page` | used with pagination. specifies what page to retrieve |
| `numProducts` | specifies the max number of products to retrieve |

### Success Response

__Status Code__ `200 OK`

__Code example__
```javascript
import BullEyeAPI from '.../bullseye';

const query = {
  category: 'Garden',
  maxPrice: 30,
  numProducts: 7
};

BullsEyeAPI.get('/api/products', query)
  .then(response => {
    console.log(response.data);
  });
```

__Example Response__
```javascript
{
  count: 123,
  products: [
    {name: "Awesome Concrete Keyboard", category: "Garden", price: 279, image: "http://lorempixel.com/640/480/cats", id: "5ea9df5b9250da00174486a6"},
    {name: "Ergonomic Plastic Mouse", category: "Garden", price: 341, image: "http://lorempixel.com/640/480/cats", id: "5ea9df419250da00174485a8"},
    {name: "Fantastic Concrete Car", category: "Garden", price: 267, image: "http://lorempixel.com/640/480/cats", id: "5ea9df6d9250da001744875c"},
    {name: "Handcrafted Granite Bike", category: "Garden", price: 239, image: "http://lorempixel.com/640/480/cats", id: "5ea9df6f9250da0017448774"},
    {name: "Intelligent Rubber Chicken", category: "Garden", price: 154, image: "http://lorempixel.com/640/480/cats", id: "5ea9df6a9250da001744873b"},
    {name: "Practical Metal Tuna", category: "Garden", price: 333, image: "http://lorempixel.com/640/480/cats", id: "5ea9df5e9250da00174486cc"},
    {name: "Unbranded Concrete Chair", category: "Garden", price: 113, image: "http://lorempixel.com/640/480/cats", id: "5ea9df439250da00174485bc"}
  ]
}
```


## `GET /api/products/:id`
retrieves a single product

`:id` - the id of the product being updated

__Auth Required:__ NO

### Success Response

__Status Code__ `200 OK`

__Code example__
```javascript
import BullEyeAPI from '.../bullseye';

BullsEyeAPI.get('/api/products/5ea9df5b9250da00174486a6')
  .then(response => {
    console.log(response.data);
  });
```

__Example Response__
```javascript
{
  product: {
    category: "Garden",
    id: "5ea9df5b9250da00174486a6",
    image: "http://lorempixel.com/640/480/cats",
    name: "Awesome Concrete Keyboard",
    price: 279
  }
}
```



## `PATCH /api/products/:id`
updates a product's data

`:id` - the id of the product being updated

__Auth Required:__ YES - at least admin permissions required

### Success Response

__Status Code__ `200 OK`

__Code example__
```javascript
import BullEyeAPI from '.../bullseye';

BullsEyeAPI.patch('/api/products/5eaae480a85db90017f66a66', {
  price: 49.99
})
  .then(response => {
    console.log(response.data);
  });
```

__Example Response__
```javascript
{
  product: {
    category: "clothing"
    id: "5eaae480a85db90017f66a66"
    image: "http://lorempixel.com/640/480"
    name: "Red Hoody"
    price: 49.99 // <- price updated
  }
}
```



## `DELETE /api/products/:id`
deletes a product

`:id` - the id of the product being deleted

__Auth Required:__ YES - at least admin permissions required

### Success Response

__Status Code__ `200 OK`

__Code example__
```javascript
import BullEyeAPI from '.../bullseye';

BullsEyeAPI.delete('/api/products/5eaae480a85db90017f66a66')
  .then(response => {
    console.log(response.data);
  });
```

__Example Response__
```javascript
{}
```
