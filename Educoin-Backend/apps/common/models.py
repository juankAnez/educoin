from django.db import models

class BaseModel(models.Model):
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ["-creado"]  # default orden descendente por creación
