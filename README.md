# Contributors:

- Helena Szczepanowska
- Tomasz Kurcoń

# Project name: Car rental

# Used technologies:

- MongoDB, Mongoose
- Node.js with Express.js,
- Postman
- Firebase Storage

# API Documentation

https://documenter.getpostman.com/view/34873190/2sA3XJjQ83#30f48e74-74fd-4d8e-8eb0-c3356289866c

# Project Documentation PL

## Schematy i modele

Mongoose, będący ODM (Object Data Modeling) dla MongoDB, oferuje nam prostą, opartą na schematach metodę modelowania danych aplikacji. Każdy stworzony schemat jest mappowany do kolekcji i definiuje jej strukturę dokumentów, zapewniając walidację danych.

Aby móc skorzystać z schematów, musimy następnie stworzyć z nich modele. Instancja modelu jest dokumentem. Modele odpowiedzialne są za tworzenie i odczytywanie dokumentów z bazy danych MongoDB.
Tworząc model, podajemy schemat oraz nazwę kolekcji, która będzie przez niego reprezentowana.

Schematy umożliwiają nam:

- ustawianie typów pól dokumentu:

```js
type: String;
```

- ustawianie wymaganych pól:

```js
required: true;
```

- wstawianie domyślnych wartości pól:

```js
default:[]
```

- ustawianie pola jako enuma

```js
enum: ["admin", "user"];
```
- ustawianie różnych właściwości pola, np typów Number zakresu wartości
```js
type: Number,
min: 1,
max: 5,
```
- oznaczanie pola jako referencji do innej kolekcji

```js
rentalId: {
    type: Schema.Types.ObjectId,
    ref: "Rental"
}
```

- automatyczne wstawianie do dokumentu timestampów

```js
timestamps: true;
```

```json
{
  "createdAt": "2024-06-02T11:58:57.343+00:00",
  "updatedAt": "2024-06-09T08:46:12.552+00:00"
}
```
To tylko niektóre z opcji oferowanych przez Mongoose. Przedstawione zostały tylko te używane przez nas w projekcie.

## Schematy stworzone w projekcie:

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
```

### userSchema

```js
const Roles = {
  ADMIN: "admin",
  USER: "user",
};
```

```js
const userSchema = new Schema({
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  roles: {
    type: [String],
    enum: [Roles.ADMIN, Roles.USER],
    default: [Roles.USER],
  },
  rentals: {
    type: [
      {
        rentalId: {
          type: Schema.Types.ObjectId,
          ref: "Rental",
          required: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
```


### carSchema

```js
const carSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    fuelType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      minimum: 1,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      default: [],
    },
    rentals: {
      type: [
        {
          rentalId: {
            type: Schema.Types.ObjectId,
            ref: "Rental",
            required: true,
          },
          startDate: {
            type: Date,
            required: true,
          },
          endDate: {
            type: Date,
            required: true,
          },
        },
      ],
      default: [],
    },
    reviews: {
      type: [
        {
          reviewId: {
            type: Schema.Types.ObjectId,
            ref: "Review",
            required: true,
          },
          user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Car", carSchema);
```

### rentalSchema

```js
const rentalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: "Car",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rental", rentalSchema);
```

### reviewSchema

```js
const reviewSchema = new Schema(
  {
    car: {
      type: Schema.Types.ObjectId,
      ref: "Car",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
```
---

Pole `_id` jest automatycznie dodawane do tworzonych schematów.

## Kolekcje i przykładowe dokumenty

Poniżej przedstawione zostały przykładowe dokumenty z stworzonych kolekcji

### Users

```json
{
  "_id": { "$oid": "66619c234fa556751d70daad" },
  "email": "admin@test.pl",
  "password": "$2a$12$FNaI1agBCQSjEoA74LwPV.t5aBAzKliPGgQUob8XQ2OtPTQa9h9tC",
  "roles": ["admin", "user"],
  "rentals": []
}
```

---

### Cars

```json
{
  "_id": { "$oid": "666570528f5eed94a75aa3a6" },
  "brand": "Audi",
  "model": "RS7",
  "pricePerDay": { "$numberInt": "3000" },
  "year": { "$numberInt": "2023" },
  "color": "blue",
  "fuelType": "gasoline",
  "quantity": { "$numberInt": "3" },
  "images": ["2024-06-09T09:05:21.671Z-audirs7.jpeg"],
  "rentals": [
    {
      "rentalId": { "$oid": "666be7678cd60b1e1e713086" },
      "startDate": { "$date": { "$numberLong": "1731283200000" } },
      "endDate": { "$date": { "$numberLong": "1731715200000" } },
      "_id": { "$oid": "666be7678cd60b1e1e713088" }
    }
  ],
  "reviews": [],
  "createdAt": { "$date": { "$numberLong": "1717923922367" } },
  "updatedAt": { "$date": { "$numberLong": "1718347623404" } }
}
```

---

### Rentals

```json
{
  "_id": { "$oid": "666be7678cd60b1e1e713086" },
  "user": { "$oid": "66532b027995bdde6e23768f" },
  "car": { "$oid": "666570528f5eed94a75aa3a6" },
  "startDate": { "$date": { "$numberLong": "1731283200000" } },
  "endDate": { "$date": { "$numberLong": "1731715200000" } },
  "price": { "$numberInt": "18000" },
  "paid": false,
  "createdAt": { "$date": { "$numberLong": "1718347623358" } },
  "updatedAt": { "$date": { "$numberLong": "1718347623358" } }
}
```

---

### Reviews

```json
{
  "_id": { "$oid": "665b76341ca600a0e90c98bc" },
  "car": { "$oid": "665b28f35b8ea7d1954b0a96" },
  "user": { "$oid": "66532b027995bdde6e23768f" },
  "description": "Very fast car, but uncomfortable!",
  "rating": { "$numberInt": "4" },
  "createdAt": { "$date": { "$numberLong": "1717270068385" } },
  "updatedAt": { "$date": { "$numberLong": "1717270068385" } }
}
```