class CartMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            if "Carro" not in request.session:
                request.session["Carro"] = {}
        response = self.get_response(request)
        return response