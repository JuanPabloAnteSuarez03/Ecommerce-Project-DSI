class Car: 
    def __init__(self, request):
        self.request = request
        self.session = request.session
        car = self.session.get("Carro")
        if not car:
            car = self.session["Carro"] = {}
        else:
            self.car = car
    
    def add (self, product):
        #si no hay el producuto selecionado por el comprardor se agraga con una unidad al carrito
        if(str(product.id) not in self.car.keys()): 
            self.car[product.id] = {
                "producto_id":product.id,
                "nombre": product.name, 
                "precio": product.price, #revisar si esta igual en la base de datos, si es entero o str
                "cantidad":1,
                "imagen": product.image.url
            }
        #Si ya esta en el carro el producto, entonces agregas otra unidad de ese articulo
        else:
            for key, value in self.car.items():
                if(key == str(product.id)):
                    value ["cantidad"] = value ["cantidad"] + 1
                    break
        
        #Actualizar la sesion
        self.save_car()

    def save_car(self):
        self.session["carro"] = self.car
        self.session.modified = True

    #Eliminar producto
    def delete (self, product):
        product.id = str(product.id)
        if(product.id in self.car):
            del self.car[product.id]
            self.save_car()

    # Restar productos
    def subtract(self, product):
        for key, value in self.car.items():
                if(key == str(product.id)):
                    value ["cantidad"] = value ["cantidad"] - 1
                    if(value["cantidad"] < 1):
                        self.delete(product)
                    break
        self.save_car()

    # Limpiar el carro
    def clean_car(self):
        self.session["Carro"] = {}
        self.session.modified = True